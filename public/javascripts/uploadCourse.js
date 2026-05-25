import {
    checkCourseFields,
    checkCoursePrice,
    checkLesson,
    setError,
    setSuccess
} from "/javascripts/miscJs/formValidationErrorHandler.js"
import {
    updateLength
} from '/javascripts/miscJs/graficalElementsCreation.js'

import {
 loadLessonsForm,
    removeLesson
} from '/javascripts/miscJs/lessonCreator.js'


const form = document.getElementById("form")
let totLessons = 1
form.addEventListener('input', () => {
    for (let i = 1; i <= totLessons; i++) {
        const lessonName = document.getElementById('lesson_' + i + '_name')
        const lessonDesc = document.getElementById('lesson_' + i + '_desc')
        const lessonNameLength = document.getElementById('length_lesson_name_' + i)
        const lessonDescLength = document.getElementById('length_lesson_desc_' + i)
        lessonName.addEventListener('input', () => updateLength(lessonName, lessonNameLength, 30))
        lessonDesc.addEventListener('input', () => updateLength(lessonDesc, lessonDescLength, 600))
    }
})

const column2 = document.getElementById('column2')
const courseName = document.getElementById('course_name')
const courseDescription = document.getElementById('course_description')
const courseCategory = document.getElementById('category')
const courseNameLengthDisplay = document.getElementById('length_course_name')
const courseDescriptionLengthDisplay = document.getElementById('length_course_desc')
const coursePrice = document.getElementById('course_price')

courseName.addEventListener('input', () => updateLength(courseName, courseNameLengthDisplay, 30))
courseDescription.addEventListener('input', () => updateLength(courseDescription, courseDescriptionLengthDisplay, 600))

coursePrice.addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/[^\d.,]/g, '')
})

column2.addEventListener('click', (event) => {
    if (event.target.closest('#addLesson')) {
        totLessons =  loadLessonsForm(totLessons, column2, true)
    }

    if (event.target.closest('#remove_lesson')) {
        totLessons = removeLesson(totLessons, column2)
    }
})

//validazione
form.addEventListener('submit', e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('courseName', courseName.value)
    formData.append('courseDesc', courseDescription.value)
    formData.append('courseCategory', courseCategory.value)
    formData.append('totLessons', totLessons.toString())
    formData.append('price', coursePrice.value)

    for (let count = 1; count <= totLessons; count++) {
        const lessonName = document.getElementById('lesson_' + count + '_name').value
        const lessonDesc = document.getElementById('lesson_' + count + '_desc').value
        const file = document.getElementById('pdf' + count).files[0]
        const video = document.getElementById('video' + count).files[0]
        formData.append('lessonName' + count, lessonName)
        formData.append('lessonDesc' + count, lessonDesc)
        formData.append('pdf' + count, file)
        formData.append('video' + count, video)
    }

    fetch('/uploadcurse', {
        method: 'POST',
        body: formData
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.error)
            for (let i = 1; i <= totLessons; i++) {
                checkLesson(i, data.error)
            }
            checkCourseFields(courseName, 'name', data.error, 30, 3)
            checkCourseFields(courseDescription, 'desc', data.error, 600, 100)
            if (data.error && data.error.some((e) => e.message.includes('invalid category'))) {
                setError(courseCategory, 'Scegliere una categoria')
            } else {
                setSuccess(courseCategory)
            }
            checkCoursePrice(coursePrice, data.error)
            if(data.success){
                window.location.href = '/profile'
            }
        })
        .catch((e) => {
            console.log(e)
        })
})






