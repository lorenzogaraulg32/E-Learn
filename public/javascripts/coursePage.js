//todo: error check code 500

import {loadCoursePage, loadCoursesSidebar} from '/javascripts/miscJs/graficalElementsCreation.js'
import {logout} from '/javascripts/miscJs/logOut.js'
//variabili utili
const sidebarCourseContainer = document.querySelector('.info_wrapper .sidebar ul')
const headerUserName = document.getElementById('user_name')
document.querySelector('.course_info_container').classList.add('inactive')
const startingText = document.getElementById('no_course_selected')
const infoContainer = document.querySelector('.course_info_container')
const divider = document.getElementById('divider0')


let currentCurse = undefined
const response = await fetch('/courses/api/user')
const userData = await response.json()
headerUserName.textContent = "Ciao " + userData.Username
const coursesList = await fetchCourses()
if (!coursesList) {
    document.getElementById('no_course_selected').textContent = 'Nessun corso comprato'
}

await loadCoursesSidebar(coursesList, sidebarCourseContainer, false)

sidebarCourseContainer.querySelectorAll('li').forEach(function (item) {
    item.addEventListener('click', function (event) {
        event.preventDefault()
        sidebarCourseContainer.querySelectorAll('li').forEach(function (otherItem) {
            otherItem.classList.remove('active')
        })
        item.classList.add('active')
        startingText.classList.add('inactive')
        infoContainer.classList.remove('inactive')
        divider.classList.add('active')
        currentCurse = loadCoursePage(item.textContent, coursesList, false)
    })

})

//redirect
document.querySelector('.main_section .course_info_container .prof_profile').addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href = `/profile/${currentCurse.profId}`
})

document.getElementById('logout').addEventListener('click', () => {
    logout()
})


//funzione per il fetch dei corsi
async function fetchCourses() {
    const response = await fetch('/courses/api/courses')
    const status = response.status
    if (status === 500) {
        return null
    } else {
        return await response.json()
    }
}






