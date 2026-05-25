import {databaseError, setError, setSuccess} from '/javascripts/miscJs/formValidationErrorHandler.js'

const cardNumberInput = document.getElementById('card_number')
const cardCVVInput = document.getElementById('card_cvv')
const currentUrl = window.location.href
const courseIdMatch = currentUrl.match(/\/buy\/(\d+)/)
const courseId = courseIdMatch?.[1] ?? null

//auto aggiunge i trattini (e li rimuove) nel field della carta di credito
//inoltre permette d'inserire solo interi
cardNumberInput.addEventListener('input', (event) => {
    let inputValue = event.target.value
    console.log(inputValue[inputValue.length - 1])
    if (inputValue[inputValue.length - 1] === '-') {
        console.log(event.target.value.slice(0, -1))
        event.target.value = inputValue.slice(0, -1)
        return
    }
    inputValue = inputValue.replace(/\D/g, '')
    if (inputValue.length > 4) {
        inputValue = inputValue.slice(0, 4) + '-' + inputValue.slice(4)
    }

    if (inputValue.length > 9) {
        inputValue = inputValue.slice(0, 9) + '-' + inputValue.slice(9)
    }

    if (inputValue.length > 14) {
        inputValue = inputValue.slice(0, 14) + '-' + inputValue.slice(14)
    }

    event.target.value = inputValue
})

//permette d'inserire solo interi
cardCVVInput.addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/\D/g, '')
})

const promise = await fetch('/buy/api/courses/' + courseId)
const currentCourse = await promise.json()
loadCourseInfo()

document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(document.getElementById('form'))
    const nome = document.getElementById('card_name')
    const cardNum = document.getElementById('card_number')
    const date = document.getElementById('card_exp_date')
    const cvv = document.getElementById('card_cvv')

    console.log(date.parentElement)

    formData.forEach((entry, key) => {
        console.log(entry, ' ', key)
    })

    const requestLink = '/buy/' + courseId

    fetch(requestLink, {
        method: 'POST',
        body: JSON.stringify({
            nome: formData.get('card_name'),
            num: formData.get('card_number'),
            exp_date: formData.get('card_exp_date'),
            cvv: formData.get('card_cvv')
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error && data.error === 'Database error'){
                databaseError()
            } else {
                const checkFields = (field, element, err, max, min) => {
                    switch (true) {
                        case err && err.some((e) => e.message.includes(element + ' empty')):
                            setError(field, 'Il campo non può essere vuoto')
                            break
                        case err && err.some((e) => e.message.includes(element + ' too short')):
                            setError(field, 'Minimo ' + min + ' caratteri')
                            break
                        case err && err.some((e) => e.message.includes(element + ' too long')):
                            setError(field, 'Massimo ' + max + ' caratteri')
                            break
                        default:
                            setSuccess(field)
                    }
                }
                checkFields(nome, 'name', data.error, 50, 5)
                checkFields(cardNum, 'cardNum', data.error, 50, 5)
                checkFields(date, 'data', data.error, 50, 5)
                checkFields(cvv, 'cvv', data.error, 50, 5)


                if (data.success) {
                    window.location.href = '/buyConf'
                }
            }
        })

})

function loadCourseInfo() {
    document.getElementById('course_name').textContent = '- ' + currentCourse.Nome
    document.getElementById('course_prof').textContent = '- Pubblicato da: ' + currentCourse.Professore
    document.getElementById('course_lessons').textContent = '- N. Lezioni: ' + currentCourse.Nlezioni
    document.getElementById('course_price').textContent = 'Totale: ' + currentCourse.Prezzo + '€'
}