import {generateCourseCard} from '/javascripts/miscJs/graficalElementsCreation.js'
import {databaseError} from "./miscJs/formValidationErrorHandler.js";

const logBtn = document.getElementById('loginBtn')
const regBtn = document.getElementById('regBtn')
const searchBtn = document.getElementById('search_btn')
const resList = document.getElementById('res_list')
const searchFail = document.querySelector('.no_search_found')

searchBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    searchCourses()
})

logBtn.addEventListener('click', (e) =>{
    e.preventDefault()
    window.location.href = "/login"
})

regBtn.addEventListener('click', (e) =>{
    e.preventDefault()
    window.location.href = "/register"
})


function searchCourses() {
    console.log('clicked')
    let input = document.getElementById('start_search').value
    resList.innerHTML = ''
    fetch('/searchCoursesStart', {
        method: 'POST',
        body: JSON.stringify({searchInput: input}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.courses) {
                searchFail.classList.remove('active')
                let count = 1
                data.courses.forEach((course) => {
                    generateCourseCard('res_list', course.Nome, course.Professore, course.Nlezioni, course.Prezzo, count)
                    let id = 'bagIcon' + count
                    document.getElementById(id).addEventListener('click', (e) => {
                        e.preventDefault()
                        window.location.href = `/login`
                    })
                    count++
                })
            } else if (data.error && data.error === 'no courses found') {
                searchFail.classList.add('active')
            } else if( data.error && data.error === 'server error'){
                databaseError()
            }
            window.scrollBy(0, 500)
        })
}
