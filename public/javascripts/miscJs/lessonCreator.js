import {
    createAddLesson,
    createArrowSvg,
    createInputElement,
    createPdfSvg,
    createSVGRemoveLesson
} from "/javascripts/miscJs/graficalElementsCreation.js"

export function createLesson(category, i, currentCurse) {
    const listItem = document.createElement('li')
    const span = document.createElement('span')
    const svg = createArrowSvg()

    const lessonHeaderContainer = document.createElement('div')
    setBackground(listItem, category)
    if(currentCurse.lezioni[i]){
        span.textContent = currentCurse.lezioni[i].Nome
    }else{
        span.textContent = ''
    }

    span.className = 'span'
    listItem.className = "lesson"
    listItem.id = i
    lessonHeaderContainer.className = 'lesson_header_container'

    listItem.appendChild(lessonHeaderContainer)
    lessonHeaderContainer.appendChild(span)
    span.prepend(svg)

    span.addEventListener('click', () => {
        expand(span, currentCurse.lezioni[i])
    })
    svg.addEventListener('click', () => {
        expand(span, currentCurse.lezioni[i])
    })
    return listItem
}

export function loadLessonsFiles(currentLesson, parent) {
    const lessonPdf = document.createElement('a')
    const lessonDescription = document.createElement('p')
    const lessonVideo = document.createElement('video')
    const divider1 = document.createElement('hr')
    const divider2 = document.createElement('hr')
    const divider3 = document.createElement('hr')

    lessonPdf.textContent = getFileName(currentLesson.PercorsoPdf)
    lessonPdf.className = 'anchor'
    lessonDescription.textContent = currentLesson.Descrizione
    lessonDescription.className = 'description'
    divider1.className = 'divider2'
    divider2.className = 'divider2'
    divider3.className = 'divider2'
    lessonPdf.href = currentLesson.PercorsoPdf
    lessonPdf.target = '_blank'

    lessonVideo.src = currentLesson.PercorsoVideo
    lessonVideo.controls = true
    lessonVideo.className = 'video'

    const svg = createPdfSvg()
    lessonPdf.prepend(svg)
    parent.appendChild(divider1)
    parent.appendChild(lessonDescription)
    parent.appendChild(divider2)
    parent.appendChild(lessonPdf)
    parent.appendChild(divider3)
    parent.appendChild(lessonVideo)

    svg.addEventListener('click', function (event) {
        event.preventDefault()
        window.open(currentLesson.PercorsoPdf, '_blank')
    })
}

function expand(element, lesson) {
    const parent = element.parentNode.parentNode
    if (parent.classList.contains('expanded')) {
        parent.classList.remove('expanded')
        removeInnerLiElements(parent)
    } else {
        document.querySelectorAll('#lessons li').forEach(item => {
            item.classList.remove('expanded')
            removeInnerLiElements(item)
        })
        parent.classList.add('expanded')
        loadLessonsFiles(lesson, parent)
    }
}

function getFileName(path) {
    let dirs = path.split('/')
    let name_ext = dirs[dirs.length - 1]
    return name_ext.split('.')[0]
}

function setBackground(liElem, category) {
    switch (true) {
        case (category === 'cucina'):
            liElem.style.backgroundImage = 'url(\'/images/cucina.jpg\')'
            break
        case (category === 'chimica'):
            liElem.style.backgroundImage = 'url(\'/images/chimica.jpg\')'
            break
        case (category === 'informatica'):
            liElem.style.backgroundImage = 'url(\'/images/informatica.jpg\')'
            break
        case (category === 'economia'):
            liElem.style.backgroundImage = 'url(\'/images/economia.jpg\')'
            break
        case (category === 'matematica'):
            liElem.style.backgroundImage = 'url(\'/images/matematica.jpg\')'
            break
    }
}

//questa funzione server quando cambiamo lezione e/o chiudiamo una lezione
function removeInnerLiElements(liElem) {
    for (let i = liElem.childNodes.length - 1; i >= 0; i--) {
        let childNode = liElem.childNodes[i]
        if (!childNode.classList.contains('lesson_header_container')) {
            liElem.removeChild(childNode)
        }
    }
}

export function loadLessonsForm(totLessons, container, fullCourse) {
    if(fullCourse){
        totLessons++
        let removeLesson = document.querySelector('.lesson_header_container svg')
        if (removeLesson) {
            removeLesson.remove()
        }
        let addLessonContainer = document.getElementById('add_lesson_container')
        if (addLessonContainer) {
            addLessonContainer.remove()
        }
    }else{
        container.innerHTML = ''
    }

    //name, desc and files
    let lessonNameInput = document.createElement('div')
    let lessonDescInput = document.createElement('div')
    let lessonPdfInput = document.createElement('div')
    let lessonVideoInput = document.createElement('div')
    let lessonNameField = createInputElement('lesson_' + totLessons + '_name', 'lesson_' + totLessons + '_name', 'Nome Lezione', 'text')
    let lessonDescField = document.createElement('textarea')
    let lessonPdfField = createInputElement('pdf' + totLessons, 'pdf' + totLessons, '', 'file')
    let lessonVideoField = createInputElement('video' + totLessons, 'video' + totLessons, '', 'file')
    let pdfLabel = document.createElement('label')
    let videoLabel = document.createElement('label')
    let lengthName = document.createElement('p')
    let lengthDesc = document.createElement('p')
    let nameErr = document.createElement('p')
    let descErr = document.createElement('p')
    let pdfErr = document.createElement('p')
    let videoErr = document.createElement('p')

    lessonDescField.id = 'lesson_' + totLessons + '_desc'
    lessonDescField.name = 'lesson_' + totLessons + '_desc'
    lessonDescField.placeholder = 'Descrizione Lezione'
    lessonDescField.rows = 6
    lessonDescField.maxLength = 600

    pdfLabel.htmlFor = 'pdf' + totLessons
    videoLabel.htmlFor = 'video' + totLessons

    pdfLabel.className = 'file_label'
    videoLabel.className = 'file_label'
    lessonPdfField.className = 'pdf'
    lessonVideoField.className = 'video'
    lessonPdfInput.className = 'container'
    lessonVideoInput.className = 'container'
    lessonNameInput.className = 'input_container'
    lessonDescInput.className = 'input_container'
    lengthName.className = 'length'
    lengthDesc.className = 'length'
    lessonPdfInput.id = 'input_containerLPDF' + totLessons
    lessonVideoInput.id = 'input_containerLMP4' + totLessons
    lessonNameInput.id = 'input_containerLN' + totLessons
    lessonDescInput.id = 'input_containerLD' + totLessons
    lengthName.id = 'length_lesson_name_' + totLessons
    lengthDesc.id = 'length_lesson_desc_' + totLessons


    nameErr.className = 'err'
    descErr.className = 'err'
    pdfErr.className = 'err'
    videoErr.className = 'err'

    pdfLabel.textContent = 'Includi un file pdf'
    videoLabel.textContent = 'Includi un video'

    lessonNameInput.appendChild(lessonNameField)
    lessonNameInput.appendChild(lengthName)
    lessonNameInput.appendChild(nameErr)

    lessonDescInput.appendChild(lessonDescField)
    lessonDescInput.appendChild(lengthDesc)
    lessonDescInput.appendChild(descErr)

    lessonPdfInput.appendChild(pdfLabel)
    lessonPdfInput.appendChild(lessonPdfField)
    lessonPdfInput.appendChild(pdfErr)

    lessonVideoInput.appendChild(videoLabel)
    lessonVideoInput.appendChild(lessonVideoField)
    lessonVideoInput.appendChild(videoErr)

    if (fullCourse) {
        //header
        let lessonHeaderContainer = document.createElement('div')
        let lessonHeader = document.createElement('h2')
        lessonHeaderContainer.className = 'lesson_header_container'
        lessonHeaderContainer.id = 'lesson_header_container' + totLessons
        lessonHeader.className = 'lesson_number'
        lessonHeader.textContent = 'Lezione ' + totLessons
        let removeLessonSVG = createSVGRemoveLesson()
        lessonHeaderContainer.appendChild(lessonHeader)
        lessonHeaderContainer.appendChild(removeLessonSVG)
        container.appendChild(lessonHeaderContainer)

        container.appendChild(lessonNameInput)
        container.appendChild(lessonDescInput)
        container.appendChild(lessonPdfInput)
        container.appendChild(lessonVideoInput)

        if (totLessons < 10) {
            container.appendChild(createAddLesson())
        }
        return totLessons
    } else {
        const divider1 = document.createElement('hr')
        const divider2 = document.createElement('hr')
        const divider3 = document.createElement('hr')
        const confBtn = document.createElement('button')
        const abort = document.createElement('a')

        abort.textContent = 'Annulla'
        abort.className = 'annulla'
        abort.classList.add('active')
        abort.id = 'annulla_lez'
        confBtn.className = 'blueBtn'
        confBtn.textContent = 'Conferma modifiche'
        divider1.className = 'divider2'
        divider2.className = 'divider2'
        divider3.className = 'divider2'
        container.appendChild(lessonNameInput)
        container.appendChild(divider1)
        container.appendChild(lessonDescInput)
        container.appendChild(divider2)
        container.appendChild(lessonPdfInput)
        container.appendChild(divider3)
        container.appendChild(lessonVideoInput)
        container.appendChild(confBtn)
        container.appendChild(abort)
        return confBtn
    }


}

export function removeLesson(totLessons, container) {
    document.getElementById('lesson_header_container' + totLessons).remove()
    document.getElementById('input_containerLN' + totLessons).remove()
    document.getElementById('input_containerLD' + totLessons).remove()
    document.getElementById('input_containerLPDF' + totLessons).remove()
    document.getElementById('input_containerLMP4' + totLessons).remove()
    totLessons--
    if (totLessons > 1) {
        document.getElementById('lesson_header_container' + totLessons).appendChild(createSVGRemoveLesson())
    }
    if (totLessons < 10 && !document.getElementById('add_lesson_container')) {
        container.appendChild(createAddLesson())
    }
    return totLessons
}
