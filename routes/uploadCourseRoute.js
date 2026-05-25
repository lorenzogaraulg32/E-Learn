'use strict'

const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')
const fs = require('fs')
const {addNewCourse} = require('../courses-dao')
const {addNewLesson} = require ('../lesson-dao')
const {publishCourse} = require("../user-dao");
const {checkTextFields, checkFileFields} = require('../validationsServerSide')

let router = express.Router()
router.use(bodyParser.urlencoded({extended: true}))

router.route('/')
    .get((req, res) => {
        res.render('../views/uploadCourse')
    })
    .post(fileUpload({debug: true}), async (req, res) => {
        //ho usato l'operator && (and) per escludere i casi in cui l'errore è undefined
        const validationErrors = []
        const courseName = req.body.courseName.trim()
        const courseDesc = req.body.courseDesc.trim()
        const courseCategory = req.body.courseCategory
        const totLessons = parseInt(req.body.totLessons)
        let coursePrice = 0
        //validazione categoria
        if (courseCategory === 'none') {
            validationErrors.push({message: 'invalid category'})
        }
        //validazioni specifiche del prezzo
        if(!req.body.price){
            validationErrors.push({message: 'course price empty'})
        }else{
            let prezzo = req.body.price
            let tokens = prezzo.split(/[.,]/)
            if (tokens.length > 1 && tokens[1].length > 2) {
                validationErrors.push({message: 'to many chars post dot'})
            } else {
                let formattedPrice = parseFloat(prezzo).toFixed(2)
                coursePrice = parseFloat(formattedPrice)
                if(coursePrice <= 0.00){
                    validationErrors.push({message: 'low price'})
                }else if (coursePrice >= 1000.00){
                    validationErrors.push({message: 'high price'})
                }
            }
        }

        checkTextFields(courseName, 'course name', 20, 3) && validationErrors.push(checkTextFields(courseName, 'course name', 30, 3))
        checkTextFields(courseDesc, 'course desc', 500, 100) && validationErrors.push(checkTextFields(courseDesc, 'course desc', 600, 100))
        const lessons = []

        for (let count = 1; count <= totLessons; count++) {
            let lessonName = req.body['lessonName' + count].trim()
            let lessonDesc = req.body['lessonDesc' + count].trim()
            let lessonPdf
            let lessonVideo
            if (req.files) {
                lessonPdf = req.files['pdf' + count]
                lessonVideo = req.files['video' + count]
            } else {
                lessonPdf = undefined
                lessonVideo = undefined
            }

            checkTextFields(lessonName, 'lesson ' + count + ' name', 30, 3) && validationErrors.push(checkTextFields(lessonName, 'lesson ' + count + ' name', 20, 3))
            checkTextFields(lessonDesc, 'lesson ' + count + ' desc', 600, 100) && validationErrors.push(checkTextFields(lessonDesc, 'lesson ' + count + ' desc', 600, 100))
            checkFileFields(lessonPdf, 'lesson ' + count + ' pdf', '.pdf') && validationErrors.push(checkFileFields(lessonPdf, 'lesson ' + count + ' pdf', '.pdf'))
            checkFileFields(lessonVideo, 'lesson ' + count + ' video', '.mp4') && validationErrors.push(checkFileFields(lessonVideo, 'lesson ' + count + ' video', '.mp4'))
            await waitTwoMillisecond()
            let lesson = {
                id: Date.now().toString(),
                nome: lessonName,
                descrizione: lessonDesc,
                pdf: lessonPdf,
                video: lessonVideo
            }
            lessons.push(lesson)
        }
        //operazioni di salvataggio corso, se i check sono passati tutti
        if (validationErrors.length > 0) {
            res.status(422).json({error: validationErrors})
        } else {

            const profId = req.user.UserId
            const profName = req.user.Nome + ' ' + req.user.Cognome
            const courseId = Date.now().toString()
            const course = {
                id: courseId,
                nome: courseName,
                descrizione: courseDesc,
                categoria: courseCategory,
                prof: profName,
                profid: profId,
                prezzo: coursePrice,
                nlez: totLessons
            }
            await addNewCourse(course)
            const courseFolder = path.join(__dirname, '../public/corsi/', courseId + '/')
            await fs.mkdir(courseFolder, (err) => {
                if (err) {
                    console.log('errore creazione folder', err)
                } else {
                    manageLessons(courseFolder, lessons, course)
                }
            })
            await publishCourse(courseId, req.user)
            res.status(200).json({success: true})
        }
    })


//questa funzione cicla tutte le lezioni che si vogliono caricare nel corso, crea le varie directory necessarie
//e poi le salva sul database, linkando gli id
async function manageLessons(folder, lessons, course) {
    for (const lesson of lessons) {
        const lessonFolder = path.join(folder, 'Lezione' + lesson.id)
        await fs.mkdir(lessonFolder, (err) => {
            if (err) {
                console.log('errore creazione folder', err)
            }
        })
        const dest1 = path.join(lessonFolder, lesson.pdf.name)
        const dest2 = path.join(lessonFolder, lesson.video.name)
        await lesson.pdf.mv(dest1, (err) => {
            if (err) {
                console.log('errore', err)
            }
        })
        await lesson.video.mv(dest2, (err) => {
            if (err) {
                console.log('errore', err)
            }
        })
        const pdfPath = '/corsi/' + course.id + '/' + 'Lezione' + lesson.id + '/' + lesson.pdf.name
        const videoPath = '/corsi/' + course.id + '/' + 'Lezione' + lesson.id  + '/' + lesson.video.name
        lesson.pdf = pdfPath
        lesson.video = videoPath
        lesson.courseId = course.id
        await addNewLesson(lesson, course.id)
    }
}

function waitTwoMillisecond() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2)
    })
}

module.exports = router