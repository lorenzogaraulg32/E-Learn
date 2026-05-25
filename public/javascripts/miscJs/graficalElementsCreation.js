import {createLesson} from "/javascripts/miscJs/lessonCreator.js";

export function createPdfSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("width", "16")
    svg.setAttribute("height", "16")
    svg.setAttribute("fill", "currentColor")
    svg.setAttribute("class", "bi bi-filetype-pdf")
    svg.setAttribute("viewBox", "0 0 16 16")
    path.setAttribute("fill-rule", "evenodd")
    path.setAttribute("d", "M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1" +
        " 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 " +
        ".161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794" +
        " 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-." +
        "3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 " +
        ".354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-." +
        "79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z")
    svg.classList.add('file_svg')
    svg.appendChild(path)
    return svg
}

export function createArrowSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path')

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('width', '16')
    svg.setAttribute('height', '16')
    svg.setAttribute('fill', 'currentColor')
    svg.setAttribute('class', 'bi bi-caret-down-fill')
    svg.setAttribute('viewBox', '0 0 16 16')
    pathElement.setAttribute('d', "M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z")
    svg.classList = 'svg'

    svg.appendChild(pathElement)
    return svg
}

export function createSVGRemoveLesson() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("fill", "currentColor")
    svg.setAttribute("class", "bi bi-dash-circle-fill")
    svg.setAttribute("viewBox", "0 0 16 16")
    svg.setAttribute("id", "remove_lesson")
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z")
    svg.appendChild(path)
    return svg
}

function createSVGAddLesson() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("class", "bi bi-plus-circle-fill")
    svg.setAttribute("viewBox", "0 0 16 16")
    svg.setAttribute("id", "addLesson")
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z")
    svg.appendChild(path)
    return svg
}

export function createSVGMod() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("width", "16")
    svg.setAttribute("height", "16")
    svg.setAttribute("fill", "currentColor")
    svg.setAttribute("class", "bi bi-pencil-fill")
    svg.setAttribute("viewBox", "0 0 16 16")
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
    pathElement.setAttribute("d", "M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646" +
        " 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 " +
        "0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-" +
        ".5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z")
    svg.appendChild(pathElement)
    return svg
}

export function createAddLesson() {
    let lessonContainer = document.createElement('div')
    let addLessonText = document.createElement('h2')
    let svg = createSVGAddLesson()
    svg.id = 'addLesson'
    addLessonText.className = 'add_lesson'
    addLessonText.textContent = 'Aggiungi lezione'

    lessonContainer.appendChild(addLessonText)
    lessonContainer.appendChild(svg)

    lessonContainer.className = 'add_lesson_container'
    lessonContainer.id = 'add_lesson_container'
    return lessonContainer
}

export function createInputElement(name, id, placeholder, type) {
    let input = document.createElement('input')
    input.id = id
    input.name = name
    input.type = type
    input.autocomplete = 'off'
    input.placeholder = placeholder
    return input
}

export function updateLength(field, display, maxLength) {
    if(!display.classList.contains('active')){
        display.classList.add('active')
    }
    display.textContent = field.value.trim().length + '/' + maxLength
}

export async function loadCoursesSidebar(coursesList, sidebarCourseContainer, modify) {
    if (coursesList) {
        for (const course of coursesList) {
            const listItem = document.createElement('li')
            const listItemName = document.createElement('a')
            const icon = document.createElement('i')
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
            const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
            const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path")

            listItemName.href = ''
            listItemName.textContent = course.nome

            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
            svg.setAttribute("width", "16")
            svg.setAttribute("height", "16")
            svg.setAttribute("fill", "currentColor")
            svg.setAttribute("class", "bi bi-journal-bookmark")
            svg.setAttribute("viewBox", "0 0 16 16")
            path1.setAttribute("fill-rule", "evenodd")
            path1.setAttribute("d", "M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8")
            path2.setAttribute("d", "M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2")
            path3.setAttribute("d", "M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z")


            icon.appendChild(svg)
            svg.appendChild(path1)
            svg.appendChild(path2)
            svg.appendChild(path3)
            listItemName.prepend(icon)
            listItem.appendChild(listItemName)
            sidebarCourseContainer.appendChild(listItem)
        }
    }else{
        if(modify){
            document.getElementById('sidebar_title').textContent = 'NON HAI PUBBLICATO NESSUN CORSO'
        }else{
            document.getElementById('sidebar_title').textContent = 'NON HAI ACQUISTATO NESSUN CORSO'
        }

    }
}

export function loadCoursePage(courseName, coursesList, modify) {
    let lessonList = document.querySelector('.lessons')
    lessonList.innerHTML = ''
    const currentCourse = coursesList.find(course => course.nome === courseName);
    console.log(courseName)
    console.log(coursesList)
    console.log(currentCourse)
    let category = currentCourse.categoria


    document.getElementById('course_name').textContent = currentCourse.nome
    document.getElementById('course_professor').textContent = currentCourse.professore
    document.getElementById('course_n_lessons').textContent = currentCourse.lezioni.length + ' ' + endText(currentCourse)

    //non posso usare le classi di stato sulla descrizione perchè ogni volta devo resettare il contenuto della pagina
    const courseDescItem = document.createElement('p')
    courseDescItem.id = 'course_desc'
    courseDescItem.className = 'course_desc'
    courseDescItem.textContent = currentCourse.descrizione
    lessonList.appendChild(courseDescItem)

    if(modify) {
        //non posso usare le classi di stato nemmeno qua stesso motivo di sopra
        lessonList.appendChild(addModBtn())
    }

    for (let i = 0; i < currentCourse.lezioni.length; i++) {
        lessonList.appendChild(createLesson(category, i, currentCourse))
    }
    return currentCourse
}

export function generateCourseCard(containerId, title, professor, numLessons, price, count) {
    const container = document.getElementById(containerId)

    const card = document.createElement('li')
    const cardContent = document.createElement('div')
    const titleElement = document.createElement('h1')
    const vl1 = document.createElement('div')
    const lessonsElement = document.createElement('h2')
    const vl2 = document.createElement('div')
    const priceElement = document.createElement('h2')
    const vl3 = document.createElement('div')
    const bagIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    card.className = 'course-card'
    card.id = 'course' + count
    cardContent.className = 'card_course_search'
    if (count === 1) {
        cardContent.style.backgroundImage = 'url(\'/images/economia.jpg\')'
    } else {
        cardContent.style.backgroundImage = 'url(\'/images/informatica.jpg\')'
    }
    titleElement.innerHTML = `${title} <br>${professor}`
    lessonsElement.innerHTML = `Numero di lezioni: ${numLessons}`
    priceElement.innerHTML = `Prezzo: ${price}$`
    vl1.classList.add('vl')
    vl2.classList.add('vl')
    vl3.classList.add('vl')
    bagIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    bagIcon.setAttribute('fill', 'currentColor')
    bagIcon.setAttribute('class', 'bi bi-bag-fill')
    bagIcon.setAttribute('viewBox', '0 0 16 16')
    bagIcon.id = 'bagIcon' + count
    titleElement.id = 'title' + count

    pathElement.setAttribute('d', 'M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z')

    cardContent.appendChild(titleElement)
    cardContent.appendChild(vl1)
    cardContent.appendChild(lessonsElement)
    cardContent.appendChild(vl2)
    cardContent.appendChild(priceElement)
    cardContent.appendChild(vl3)
    bagIcon.appendChild(pathElement)
    cardContent.appendChild(bagIcon)
    card.appendChild(cardContent)
    container.appendChild(card)
}

export function setBlur(mainSection, sidebar, infoSection) {
    mainSection.classList.add('blur')
    sidebar.classList.add('blur')
    infoSection.classList.add('blur')
}

export function removeBlur(mainSection, sidebar, infoSection) {
    mainSection.classList.remove('blur')
    sidebar.classList.remove('blur')
    infoSection.classList.remove('blur')
}


function addModBtn(){
    const modCourse = document.createElement('button')
    modCourse.className = 'redBtn'
    modCourse.textContent = 'Modifica corso'
    modCourse.id = 'mod_course'
    return modCourse
}

function endText(currentCourse){
    if (currentCourse.lezioni.length > 1) {
       return 'Lezioni'
    }
    return 'Lezione'
}