import {

    createSVGMod,
    loadCoursePage,
    loadCoursesSidebar,
    removeBlur,
    setBlur,
    updateLength,
} from '/javascripts/miscJs/graficalElementsCreation.js'
import {createLesson, loadLessonsForm} from "/javascripts/miscJs/lessonCreator.js";
import {
    checkCourseFields,
    checkCoursePrice,
    checkLesson, databaseError,
} from "/javascripts/miscJs/formValidationErrorHandler.js"

import {logout} from '/javascripts/miscJs/logOut.js'

//retrive dati dal server tramite fetch
const userPromise = await fetch('/modify/api/user')
const userData = await userPromise.json()
const coursesPromise = await fetch('/modify/api/modCourses')
let coursesList = await coursesPromise.json()
let currentItem = undefined
let currentCourse = undefined

//variabili elementi pagina
const confModBtn = document.getElementById('course_mod_conf')
const courseNameContainer = document.getElementById('course_name_input_container')
const courseName = document.getElementById('course_name_i')
const courseNameLengthDisplay = document.getElementById('length_course_name')
const courseDesc = document.getElementById('course_desc_i')
const courseDescLengthDisplay = document.getElementById('length_course_desc')
const sidebarCourseContainer = document.querySelector('.info_wrapper .sidebar ul')
const lessonSection = document.getElementById('lessons')
const headerUserName = document.getElementById('user_name')
const addLesson = document.getElementById('add_new_lesson')
const infoSection = document.querySelector('.info_wrapper .info_section')
const mainSection = document.getElementById('main_section')
const alertForDeletion = document.getElementById('alert')
const sidebar = document.querySelector('.info_wrapper .sidebar')

document.getElementById('abort_delete').addEventListener('click', (e) => {
    e.preventDefault()
    removeBlur(mainSection, sidebar, infoSection)
    alertForDeletion.classList.remove('active')
})
document.getElementById('delete_course').addEventListener('click', (e) => {
    e.preventDefault()
    if (checkAlreadyMod()) {
        window.alert('Puoi modificare solo una sezione per volta')
    } else {
        deleteCourse(currentCourse.id)
    }
})

document.getElementById('logout').addEventListener('click', (e) => {
    logout()
})
document.querySelector('.course_info_container').classList.add('inactive')
await loadCoursesSidebar(coursesList, sidebarCourseContainer, true)
headerUserName.textContent = "Ciao " + userData.Username
addLesson.addEventListener('click', (e) => {
    e.preventDefault()
    if (checkAlreadyMod()) {
        window.alert('Puoi modificare solo una sezione per volta')
    } else {
        addLesson.classList.remove('active')
        const liElem = createLesson(currentCourse.categoria, currentCourse.lezioni.length, currentCourse)
        lessonSection.appendChild(liElem)
        const addBtn = loadLessonsForm(liElem.id, liElem, false)
        const lessonNameField = document.getElementById('lesson_' + liElem.id + '_name')
        const lessonDescField = document.getElementById('lesson_' + liElem.id + '_desc')
        const lessonNameLength = document.getElementById('length_lesson_name_' + liElem.id)
        const lessonDescLength = document.getElementById('length_lesson_desc_' + liElem.id)
        lessonNameField.addEventListener('input', () => updateLength(lessonNameField, lessonNameLength, 30))
        lessonDescField.addEventListener('input', () => updateLength(lessonDescField, lessonDescLength, 600))
        liElem.classList.add('mod')
        const abort = document.getElementById('annulla_lez')
        //pulsante per annullare le modifiche
        abort.addEventListener('click', async (e) => {
            e.preventDefault()
            liElem.remove()
            addLesson.classList.add('active')
        })
        addBtn.addEventListener('click', (e) => {
            e.preventDefault()
            addNewLesson(liElem.id)
        })
    }
})
sidebarCourseContainer.querySelectorAll('li').forEach(function (item) {
    item.addEventListener('click', async function (event) {
        event.preventDefault()
        currentItem = item
        await loadCourse(item)
    })
})

async function loadCourse(item) {
    sidebarCourseContainer.querySelectorAll('li').forEach(function (otherItem) {
        otherItem.classList.remove('active')
    })
    item.classList.add('active')
    document.getElementById('no_course_selected').classList.add('inactive')
    document.querySelector('.course_info_container').classList.remove('inactive')
    document.getElementById('divider0').classList.add('active')
    currentCourse = await loadCoursePage(item.textContent, coursesList, true)
    const modBTN = document.getElementById('mod_course')

    modBTN.addEventListener('click', (e) => {
        e.preventDefault()
        if (checkAlreadyMod()) {
            window.alert('Puoi modificare solo una sezione per volta')
        } else {
            modBTN.style.display = 'none'
            createModSectionCourse(item)
        }
    })

    document.querySelectorAll('.lesson_section li .lesson_header_container').forEach((lessonHeader) => {
        const container = createModSectionLesson(lessonHeader.parentElement, lessonHeader.parentElement.textContent)
        lessonHeader.appendChild(container)
    })

    if (currentCourse.lezioni.length < 9) {
        addLesson.classList.add('active')
    }
}

function addNewLesson(id) {
    const lessonNameField = document.getElementById('lesson_' + id + '_name').value
    const lessonDescField = document.getElementById('lesson_' + id + '_desc').value
    const file = document.getElementById('pdf' + id).files[0]
    const video = document.getElementById('video' + id).files[0]
    const formData = new FormData()
    formData.append('listItem', id)
    formData.append('currentCourse', currentCourse.id)
    formData.append('lessonName', lessonNameField)
    formData.append('lessonDesc', lessonDescField)
    formData.append('pdf', file)
    formData.append('video', video)

    fetch('/modify/api/addLesson', {
        method: 'POST',
        body: formData
    })
        .then((res) => res.json())
        .then(async (data) => {
            if(data.error && data.error === 'server error'){
                databaseError()
            } else if (data.error) {
                checkLesson(id, data.error)
            } else if (data.success) {
                const coursesPromise = await fetch('/modify/api/modCourses')
                coursesList = await coursesPromise.json()
                await loadCourse(currentItem)
            }
        })
        .catch((error) => {
            console.log('Error:', error)
            databaseError()
        })
}

function modifyLesson(id, lessonId) {
    const lessonNameField = document.getElementById('lesson_' + id + '_name').value
    const lessonDescField = document.getElementById('lesson_' + id + '_desc').value
    const file = document.getElementById('pdf' + id).files[0]
    const video = document.getElementById('video' + id).files[0]
    const formData = new FormData()
    formData.append('listItem', id)
    formData.append('lessonId', lessonId)
    formData.append('lessonName', lessonNameField)
    formData.append('lessonDesc', lessonDescField)
    formData.append('pdf', file)
    formData.append('video', video)


    fetch('/modify/api/modLesson', {
        method: 'POST',
        body: formData
    })
        .then((res) => res.json())
        .then(async (data) => {
            if(data.error && data.error === 'server error'){
                databaseError()
            } else if (data.error) {
                checkLesson(id, data.error)
            } else if (data.success) {
                const coursesPromise = await fetch('/modify/api/modCourses')
                coursesList = await coursesPromise.json()
                await loadCourse(currentItem)
            }
        })
        .catch((error) => {
            console.log('Error:', error)
            databaseError()
        })

}
function modifyCourse(id) {
    const courseNameField = document.getElementById('course_name_i')
    const courseDescField = document.getElementById('course_desc_i')
    const courseCategory = document.getElementById('category')
    const coursePrice = document.getElementById('course_price')
    const formData = new FormData()
    formData.append('courseId', id)
    formData.append('courseName', courseNameField.value)
    formData.append('courseDesc', courseDescField.value)
    formData.append('courseCategory', courseCategory.value)
    formData.append('coursePrice', coursePrice.value)

    fetch('/modify/api/modCourse', {
        method: 'POST',
        body: JSON.stringify({
            id: formData.get('courseId'),
            courseName: formData.get('courseName'),
            courseDesc: formData.get('courseDesc'),
            courseCategory: formData.get('courseCategory'),
            coursePrice: formData.get('coursePrice')
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then(async (data) => {
            if(data.error && data.error === 'server error'){
                databaseError()
            } else if (data.error) {
                checkCourseFields(courseNameField, 'name', data.error, 30, 3)
                checkCourseFields(courseDescField, 'desc', data.error, 600, 100)
                checkCoursePrice(coursePrice, data.error)
            } else if (data.success) {
                currentItem.firstChild.textContent = courseNameField.value.trim()
                const coursesPromise = await fetch('/modify/api/modCourses')
                coursesList = await coursesPromise.json()
                courseNameContainer.style.display = 'none'
                document.getElementById('course_name').style.display = 'block'
                document.getElementById('mod_course_section').classList.remove('active')
                await loadCourse(currentItem)
            }
        })
        .catch((error) => {
            console.log('Error:', error)
        })

}

function deleteLesson(id) {
    const lessonList = document.getElementById('lessons')
    if (checkAlreadyMod()) {
        window.alert('Puoi modificare solo una sezione per volta')
    } else if(lessonList.childElementCount <= 3){
        window.alert('È necessaria almeno 1 lezione per corso')
    } else {
        setBlur(mainSection, sidebar, infoSection)
        alertForDeletion.classList.add('active')
        document.getElementById('continue_delete').addEventListener('click', (e) => {
            e.preventDefault()
            const formData = new FormData()
            formData.append('listItem', id)
            fetch('/modify/api/removeLesson', {
                method: 'POST',
                body: JSON.stringify({
                    listItem: formData.get('listItem'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then(async (data) => {
                    if (data.success) {
                        removeBlur(mainSection, sidebar, infoSection)
                        alertForDeletion.classList.remove('active')
                        const coursesPromise = await fetch('/modify/api/modCourses')
                        coursesList = await coursesPromise.json()
                        await loadCourse(currentItem)
                    }else{
                        databaseError()
                    }
                })
                .catch((e) => {
                    console.log(e)
                    databaseError()
                })
        })
    }
}
function deleteCourse(id) {
    setBlur(mainSection, sidebar, infoSection)
    alertForDeletion.classList.add('active')
    console.log(id)
    document.getElementById('continue_delete').addEventListener('click', (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('courseId', id)
        fetch('/modify/api/removeCourse', {
            method: 'POST',
            body: JSON.stringify({
                courseId: formData.get('courseId'),
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.success) {
                    removeBlur(mainSection, sidebar, infoSection)
                    alertForDeletion.classList.remove('active')
                    location.reload()
                }else{
                    databaseError()
                }
            })
            .catch((error) => {
                console.log('Error:', error)
                databaseError()
            })
    })
}

function createModSectionCourse(item) {
    document.getElementById('mod_course_section').classList.add('active')

    confModBtn.classList.add('active')

    document.getElementById('course_name').style.display = 'none'
    document.getElementById('course_desc').style.display = 'none'
    courseNameContainer.style.display = 'block'

    courseName.addEventListener('input', () => updateLength(courseName, courseNameLengthDisplay, 30))
    courseName.value = currentCourse.nome

    document.getElementById('course_desc_i').addEventListener('input', () => updateLength(courseDesc, courseDescLengthDisplay, 600))
    courseDesc.value = currentCourse.descrizione

    const courseCategory = document.getElementById('category')
    courseCategory.value = currentCourse.categoria

    const coursePrice = document.getElementById('course_price')
    coursePrice.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^\d.,]/g, '')
    })
    coursePrice.value = currentCourse.prezzo

    const abort = document.getElementById('annulla_course')
    abort.classList.add('active')
    abort.addEventListener('click', async (e) => {
        e.preventDefault()
        courseNameContainer.style.display = 'none'
        document.getElementById('course_name').style.display = 'block'
        document.getElementById('mod_course_section').classList.remove('active')
        await loadCourse(item)
    })

    const confCourseModification = document.getElementById('course_mod_conf')
    confCourseModification.addEventListener('click', (e) => {
        e.preventDefault()
        modifyCourse(currentCourse.id)
    })
}

function createModSectionLesson(liElem, lessonName) {
    const container = document.createElement('div')
    const removeLesson = document.createElement('button')
    container.className = 'mod_container'
    removeLesson.className = 'redBtn'
    removeLesson.textContent = 'Elimina Lezione'
    removeLesson.id = 'delete_lesson'
    const modIcon = createSVGMod()
    removeLesson.addEventListener('click', (e) => {
        e.preventDefault()
        if (checkAlreadyMod()) {
            window.alert('Puoi modificare solo una sezione per volta')
        } else {
            const currentLesson = getCurrentLesson(lessonName)
            deleteLesson(currentLesson.IdLezione)
        }
    })
    modIcon.addEventListener('click', () => {
        if (checkAlreadyMod()) {
            window.alert('Puoi modificare solo una sezione per volta')
        } else {
            const currentLesson = getCurrentLesson(lessonName)
            const confBtn = loadLessonsForm(liElem.id, liElem, false)
            liElem.classList.add('mod')
            addPlaceholderLessons(currentLesson, liElem.id)
            const abort = document.getElementById('annulla_lez')
            abort.addEventListener('click', async (e) => {
                e.preventDefault()
                liElem.classList.remove('mod')
                liElem.replaceWith(createLesson(currentCourse.categoria, liElem.id, currentCourse))
                liElem = document.getElementById(liElem.id)
                liElem.firstChild.appendChild(container)
            })
            confBtn.addEventListener('click', () => modifyLesson(liElem.id, currentLesson.IdLezione, liElem));
        }
    })
    container.appendChild(modIcon)
    container.appendChild(removeLesson)

    return container
}

function getCurrentLesson(lessonName) {
    let currentLesson = {}
    currentCourse.lezioni.forEach(lezione => {
        if (lezione.Nome === lessonName) {
            currentLesson = lezione
        }
    })
    return currentLesson
}

function checkAlreadyMod() {
    const modCourseSection = document.getElementById('mod_course_section')
    if (modCourseSection.classList.contains('active')) {
        return true
    }
    const listElements = lessonSection.querySelectorAll('li')
    for (const li of listElements) {
        if (li.classList.contains('mod')) {
            return true
        }
    }
    return false
}

function addPlaceholderLessons(currentLesson, id) {
    const lessonNameField = document.getElementById('lesson_' + id + '_name')
    const lessonDescField = document.getElementById('lesson_' + id + '_desc')
    const lessonNameLength = document.getElementById('length_lesson_name_' + id)
    const lessonDescLength = document.getElementById('length_lesson_desc_' + id)
    lessonNameField.addEventListener('input', () => updateLength(lessonNameField, lessonNameLength, 30))
    lessonDescField.addEventListener('input', () => updateLength(lessonDescField, lessonDescLength, 600))
    lessonNameField.value = currentLesson.Nome
    lessonDescField.value = currentLesson.Descrizione
}



