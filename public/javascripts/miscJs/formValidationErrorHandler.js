export function setError(elem, msg) {
    const inputControl = elem.parentElement
    const errorDisplay = inputControl.querySelector('.err')
    errorDisplay.innerText = msg
    errorDisplay.classList.add('active')
    inputControl.classList.add('failure')
}

export function setSuccess(elem) {
    const inputControl = elem.parentElement
    const errorDisplay = inputControl.querySelector('.err')
    errorDisplay.innerText = ''
    errorDisplay.classList.remove('active')
    inputControl.classList.remove('failure')
}

export function onlyLetters(str) {
    return /^[a-zA-Z]+$/.test(str)
}

export function hasUppercase(str) {
    return /[A-Z]/.test(str)
}

export function hasNumber(str) {
    return /[0-9]/.test(str)
}

export function isValidEmail(str) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(str.toLowerCase())
}

export function checkCourseFields(field, element, err, max, min){
    switch (true) {
        case err && err.some((e) => e.message.includes('course ' + element + ' empty')):
            setError(field, 'Il campo non può essere vuoto')
            break
        case err && err.some((e) => e.message.includes('course ' + element + ' too short')):
            setError(field, 'Minimo ' + min + ' caratteri')
            break
        case err && err.some((e) => e.message.includes('course ' + element + ' too long')):
            setError(field, 'Massimo ' + max + ' caratteri')
            break
        default:
            setSuccess(field)
    }
}

export function checkCoursePrice(field, err){
    switch (true) {
        case err && err.some((e) => e.message.includes('course price empty')):
            setError(field, 'Il campo non può essere vuoto')
            break
        case err && err.some((e) => e.message.includes('low price')):
            setError(field, 'Prezzo troppo basso')
            break
        case err && err.some((e) =>e.message.includes('high price')):
            setError(field, 'Prezzo troppo alto')
            break
        case err && err.some((e) =>e.message.includes('to many chars post dot')):
            setError(field, 'Massimo 2 cifre decimali')
            break
        default:
            setSuccess(field)
    }
}

export function checkLesson(i, err) {
    let currentLessonName = document.getElementById('lesson_' + i + '_name')
    let currentLessonDescription = document.getElementById('lesson_' + i + '_desc')
    let currentLessonPdf = document.getElementById('pdf' + i)
    let currentLessonVideo = document.getElementById('video' + i)

    const checkField = (field, inputType, limits, fileType) => {
        switch (true) {
            case err && err.some((e) => e.message.includes('lesson ' + i + ' ' + inputType + ' empty')):
                setError(field, 'Il campo non può essere vuoto')
                break
            case err && err.some((e) => e.message.includes('lesson ' + i + ' ' + inputType + ' too short')):
                setError(field, 'Il campo deve contenere almeno ' + limits.min + ' caratteri')
                break
            case err && err.some((e) => e.message.includes('lesson ' + i + ' ' + inputType + ' too long')):
                setError(field, 'Il campo può contenere al massimo ' + limits.max + ' caratteri')
                break
            case err && err.some((e) => e.message.includes('lesson ' + i + ' ' + inputType + ' invalid ' + fileType)):
                setError(field, 'Puoi caricare solo file ' + fileType)
                break
            default:
                setSuccess(field)
        }
    }

    checkField(currentLessonName, 'name', {min: 3, max: 30})
    checkField(currentLessonDescription, 'desc', {min: 100, max: 600})
    checkField(currentLessonPdf, 'pdf', null, '.pdf')
    checkField(currentLessonVideo, 'video', null, '.mp4')
}

export function databaseError() {
    window.alert("Errore database o Server, per favore ricaricare la pagina")
    setTimeout(function () {
        window.location.reload()
    }, 5000)
}