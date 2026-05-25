'use strict'

const express = require('express')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const util = require('util')

const fs = require('fs')
const fs1 = require('fs').promises
const {getUserPubCourses} = require('../user-dao')
const {
    getCourseInfo, updateCourseName, updateCourseDescription, updateCoursePrice, updateCourseCategory, deleteCourse,
    deleteCourseFromPubblicati, deleteCourseFromComprati, updateCourseLessonNumber
} = require("../courses-dao")
const {
    getCourseLessons,
    updateLessonName,
    updateLessonDesc,
    getLessonById,
    updateLessonPdf,
    updateLessonVideo, addNewLesson, deleteLesson
} = require('../lesson-dao')
const {checkTextFields, checkFileFields} = require('../validationsServerSide')
const path = require("path");
const unlinkAsync = util.promisify(fs.unlink)

let router = express.Router()
router.use(bodyParser.urlencoded({extended: true}))

router.get('/', (req, res) => {
    res.render('../views/modCoursePage')
})

router.get('/api/modCourses', async (req, res) => {
    try {
        const courses = await getUserPubCourses(req.user)
        let coursesArray = []
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i]
            const c = await getCourseInfo(course)
            const lessons = await getCourseLessons(c.CourseId)
            const courseObj = {
                id: c.CourseId,
                nome: c.Nome || null,
                descrizione: c.Descrizione || null,
                professore: c.Professore || null,
                profId: c.ProfId || null,
                prezzo: c.Prezzo || null,
                categoria: c.Categoria || null,
                lezioni: lessons || null,
            }
            coursesArray.push(courseObj)
        }
        res.json(coursesArray)
    } catch (e) {
        console.log('Ignore Error :' + e)
        res.json(null)
    }

})

router.get('/api/user', async (req, res) => {
    res.json(req.user)
})

//modifica i campi di una lezione, a seguito della modifica di un file il file precedente
//viene eliminato, sostituito e il path aggiornato nel database
router.post('/api/modLesson', fileUpload({debug: true}), async (req, res) => {
    const validationErrors = []
    const lessonId = req.body.lessonId
    const listId = parseInt(req.body.listItem)

    const currentLesson = await getLessonById(lessonId)
    const currentCourse = await getCourseInfo(currentLesson.IdCorso)
    const lessonName = req.body.lessonName.trim()
    const lessonDesc = req.body.lessonDesc.trim()
    let lessonPdf
    let lessonVideo
    if (req.files) {
        lessonPdf = req.files['pdf']
        lessonVideo = req.files['video']
    }

    if (!currentCourse || !currentLesson) {
        return res.status(500).json({error: 'server error'})
    }
    if (!checkCourseIsFromUser(req.user, currentCourse) && !checkLessonIsFromCourse(currentLesson, currentCourse)) {
        return res.status(500).json({error: 'server error'})
    }

    const pathToSave = '/corsi/' + currentCourse.CourseId + '/Lezione' + lessonId + '/'

    //ho usato l'operatore && (and) per escludere i casi in cui l'errore è undefined
    //ignoro i casi in cui un campo è vuoto, l'elemento rimane invariato
    if (lessonName) {
        checkTextFields(lessonName, 'lessonName', 30, 3) && validationErrors.push(checkTextFields(lessonName, 'lesson ' + listId + ' name', 30, 3))
    }
    if (lessonDesc) {
        checkTextFields(lessonDesc, 'lessonDesc', 600, 100) && validationErrors.push(checkTextFields(lessonDesc, 'lesson ' + listId + ' desc', 600, 100))
    }
    if (lessonPdf) {
        checkFileFields(lessonPdf, 'pdf', '.pdf') && validationErrors.push(checkFileFields(lessonPdf, 'lesson ' + listId + ' pdf', '.pdf'))
    }
    if (lessonVideo) {
        checkFileFields(lessonVideo, 'video', '.mp4') && validationErrors.push(checkFileFields(lessonVideo, 'lesson ' + listId + ' video', '.mp4'))
    }


    if (validationErrors.length > 0) {
        return res.status(422).json({error: validationErrors})
    } else {
        //aggiorno i campi solo se non sono vuoti, altrimenti rimangono invariati
        if (lessonName) {
            await updateLessonName(lessonName, lessonId)
        }
        if (lessonDesc) {
            await updateLessonDesc(lessonDesc, lessonId)
        }
        if (lessonPdf !== undefined) {
            const oldPdfPath = path.join(__dirname, '../public', currentLesson.PercorsoPdf)
            const newPdfPath = pathToSave + lessonPdf.name
            try {
                await handleReplaceFile(lessonPdf, oldPdfPath, newPdfPath, updateLessonPdf, lessonId);
            } catch (error) {
                return res.status(500).json({error: 'server error'});
            }
        }
        if (lessonVideo !== undefined) {
            const oldVideoPath = path.join(__dirname, '../public', currentLesson.PercorsoVideo)
            const newVideoPath = pathToSave + lessonVideo.name
            try {
                await handleReplaceFile(lessonVideo, oldVideoPath, newVideoPath, updateLessonVideo, lessonId);
            } catch (error) {
                return res.status(500).json({error: 'server error'});
            }
        }
        return res.status(200).json({success: true})
    }
})

//questa routine gestisce la modifica delle singole parti del corso, oppure di tutte insieme, aggioerna i dati sul database
//e modifica la cartella di salvataggio del corso
router.post('/api/modCourse', async (req, res) => {
    const validationErrors = []
    const courseId = req.body.id
    const courseName = req.body.courseName.trim()
    const courseDesc = req.body.courseDesc.trim()
    const coursePrice = req.body.coursePrice
    const courseCategory = req.body.courseCategory
    const currentCourse = getCourseInfo(courseId)

    if (!currentCourse) {
        console.log('no current course')
        return res.status(500).json({error: 'server error'})
    }
    if (courseName) {
        checkTextFields(courseName, 'lessonName', 30, 3) && validationErrors.push(checkTextFields(courseName, 'course name', 30, 3))
    }
    if (courseDesc) {
        checkTextFields(courseDesc, 'lessonDesc', 600, 100) && validationErrors.push(checkTextFields(courseDesc, 'course desc', 600, 100))
    }
    if (coursePrice) {
        let tokens = coursePrice.split(/[.,]/)
        if (tokens.length > 1 && tokens[1].length > 2) {
            validationErrors.push({message: 'to many chars post dot'})
        } else {
            let formattedPrice = parseFloat(coursePrice).toFixed(2)
            let finalPrice = parseFloat(formattedPrice)
            if (finalPrice <= 0.00) {
                validationErrors.push({message: 'low price'})
            } else if (finalPrice >= 1000.00) {
                validationErrors.push({message: 'high price'})
            }
        }
    }
    if (validationErrors.length > 0) {
        res.status(422).json({error: validationErrors})
    } else {
        if (courseName) {
            await updateCourseName(courseName, courseId)
        }
        if (courseDesc) {
            await updateCourseDescription(courseDesc, courseId)
        }
        if (coursePrice) {
            await updateCoursePrice(coursePrice, courseId)
        }
        if (courseCategory !== 'none') {
            await updateCourseCategory(courseCategory, courseId)
        }
        return res.status(200).json({success: true})
    }
})

//crea e aggiunge una lezione al corso, aggiorno il contatore nel database n lezioni corso
router.post('/api/addLesson', fileUpload({debug: true}), async (req, res) => {
    const id = Date.now().toString()
    const validationErrors = []
    const listId = parseInt(req.body.listItem)
    let currentCourse = req.body.currentCourse
    currentCourse = await getCourseInfo(currentCourse)
    const pathToSave = '/corsi/' + currentCourse.CourseId + '/Lezione' + id + '/'

    const lessonName = req.body.lessonName.trim()
    const lessonDesc = req.body.lessonDesc.trim()
    let lessonPdf
    let lessonVideo
    if (req.files) {
        lessonPdf = req.files['pdf']
        lessonVideo = req.files['video']
    }

    if (!currentCourse) {
        return res.status(500).json({error: 'server error'})
    }

    checkTextFields(lessonName, 'lessonName', 30, 3) && validationErrors.push(checkTextFields(lessonName, 'lesson ' + listId + ' name', 30, 3))
    checkTextFields(lessonDesc, 'lessonDesc', 600, 100) && validationErrors.push(checkTextFields(lessonDesc, 'lesson ' + listId + ' desc', 600, 100))
    checkFileFields(lessonPdf, 'pdf', '.pdf') && validationErrors.push(checkFileFields(lessonPdf, 'lesson ' + listId + ' pdf', '.pdf'))
    checkFileFields(lessonVideo, 'video', '.mp4') && validationErrors.push(checkFileFields(lessonVideo, 'lesson ' + listId + ' video', '.mp4'))

    if (validationErrors.length > 0) {
        return res.status(422).json({error: validationErrors})
    } else {
        await fs.mkdir(path.join(__dirname, '../public', pathToSave), (err) => {
            if (err) {
                console.log('errore creazione folder', err)
            }
        })
        const pdfPath = pathToSave + lessonPdf.name
        const videoPath = pathToSave + lessonVideo.name
        await lessonVideo.mv(path.join(__dirname, '../public', videoPath))
        await lessonPdf.mv(path.join(__dirname, '../public', pdfPath))
        const lesson = {
            id: id,
            nome: lessonName,
            descrizione: lessonDesc,
            pdf: pdfPath,
            video: videoPath
        }
        await addNewLesson(lesson, currentCourse.CourseId)
        await updateCourseLessonNumber(currentCourse.Nlezioni + 1, currentCourse.CourseId)
        return res.status(200).json({success: true})
    }

})

//rimuove una lezione dal corso
router.post('/api/removeLesson', async (req, res) => {
    try {
        const lessonID = parseInt(req.body.listItem)
        const currentLesson = await getLessonById(lessonID)
        const currentCourse = await getCourseInfo(currentLesson.IdCorso)
        if (currentCourse.Nlezioni <= 1) {
            return res.status(500).json({err: true})
        }
        const tokens = currentLesson.PercorsoPdf.split('/');
        const lessonPath = tokens.slice(0, -1).join('/');
        const lessonFolder = path.join(__dirname, '../public', lessonPath)
        await fs1.rm(lessonFolder, {recursive: true})
        await deleteLesson(lessonID)
        await updateCourseLessonNumber(currentCourse.Nlezioni - 1, currentCourse.CourseId)
        return res.status(200).json({success: true})
    } catch (err) {
        console.log('Error removing lesson:', err);
        return res.status(500).json({err: true})
    }
})

//questa routine rimuove il corso e ogni sua sottolezione sia a livello di database
// che a livello di directory, senza sprecare memoria
router.post('/api/removeCourse', async (req, res) => {
    try {
        const courseID = req.body.courseId
        const currentCourse = await getCourseInfo(courseID)
        const courseLessons = await getCourseLessons(courseID)
        for (const lesson of courseLessons) {
            await deleteLesson(lesson.IdLezione);
        }
        const coursePath = path.join(__dirname, '../public/corsi/' + courseID)
        await fs1.rm(coursePath, {recursive: true})
        await deleteCourse(courseID)
        await deleteCourseFromPubblicati(courseID, req.user)
        await deleteCourseFromComprati(courseID)
        return res.status(200).json({success: true})
    } catch (err) {
        console.log('Error removing Course:', err);
        return res.status(500).json({err: true})
    }
})

async function handleReplaceFile(file, oldPath, newPath, updateFunction, lessonId) {
    try {
        await unlinkAsync(oldPath);
        await file.mv(path.join(__dirname, '../public', newPath));
        await updateFunction(newPath, lessonId);
    } catch (error) {
        console.log('Error handling file upload:', error);
        throw error;
    }
}

module.exports = router