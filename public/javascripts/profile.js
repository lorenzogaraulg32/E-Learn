import {databaseError, setError, setSuccess} from '/javascripts/miscJs/formValidationErrorHandler.js'
import {generateCourseCard, removeBlur, setBlur} from '/javascripts/miscJs/graficalElementsCreation.js'
import {logout} from '/javascripts/miscJs/logOut.js'

const sidebarContainer = document.querySelector('.info_wrapper .sidebar ul')
const name = document.getElementById('user_name')
const mainSection = document.getElementById('main_section')
const sidebar = document.querySelector('.info_wrapper .sidebar')
const infoSection = document.querySelector('.info_wrapper .info_section')
const currentUrl = window.location.href
const profIdMatch = currentUrl.match(/\/profile\/(\d+)/)
const profId = profIdMatch?.[1] ?? null
let isMyAcc = false
const profilePick = document.querySelector('.profile_pic')
const profileSection = document.querySelector('.profile_section')
const searchSection = document.querySelector('.search_section')
const uploadSection = document.querySelector('.upload_section')
const searchFail = document.querySelector('.no_search_found')
const researchResults = document.getElementById('res_list')
const profileSectionFullName = document.querySelector('.main_user_info h1')
const profileSectionUsername = document.querySelector('.main_user_info h3')
const profileSectionEmail = document.querySelector('.credential_user_info h2')
const modEmailForm = document.querySelector('.mod_form_email')
const modPasswordForm = document.querySelector('.mod_form_password')
const modProfilePickForm = document.querySelector('.mod_profile_pick')
const modEmailSuccess = document.querySelector('.mod_email')
const modPasswordSuccess = document.querySelector('.mod_pass')
const modPicksSuccess = document.querySelector('.mod_pick')
const abortModEmail = document.getElementById('annulla_email')
const abortModPassword = document.getElementById('annulla_pass')
const abortModPick = document.getElementById('annulla_img')
const fileSelector = document.querySelector('.container')
const modEmail = document.getElementById('mod_email')
const modPassword = document.getElementById('mod_password')


const promise1 = await fetch('/profile/api/prof/' + profId)
const professor = await promise1.json()
const promise = (await fetch('/profile/api/user'))
const loggedUser = await promise.json()


if (loggedUser.UserId === professor.UserId) {
    isMyAcc = true
    if (loggedUser.ProfilePic === 'yes') {
        profilePick.src = '/profilePics/' + loggedUser.UserId + '.png'
    }
} else {
    isMyAcc = false
    if (professor.ProfilePic) {
        profilePick.src = '/profilePics/' + professor.UserId + '.png'
    }
}

name.textContent = "Ciao " + loggedUser.Username

//Posso visitare anche il profilo di un professore, quindi gestisco il tutto con una variabile booleana. Questo garantisce che anche nel caso si possa arrivare ad'un profilo
//che non è il nostro non sia possibile modificare e/o visualizzare contenuti importanti
if (isMyAcc) {
    profileSectionUsername.textContent = loggedUser.Username
    profileSectionFullName.textContent = loggedUser.Nome + ' ' + loggedUser.Cognome
    profileSectionEmail.textContent = loggedUser.Email
} else {
    profileSectionUsername.textContent = professor.Username
    profileSectionFullName.textContent = professor.Nome + ' ' + professor.Cognome
    profileSectionEmail.textContent = professor.Email
    document.getElementById('mod_email').style.display = 'none'
    document.getElementById('mod_password').style.display = 'none'
    profilePick.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()
    })
}

document.querySelector('.info_wrapper .sidebar ul li:first-child').classList.add('active')
loadPage(profileSection)

//trigger per il load delle varie pagine
sidebarContainer.querySelectorAll('li').forEach(function (item) {
    //la sidebar cambia se si visita il proprio profilo oppure il profilo di un professore
    if (!isMyAcc) {
        if (item.textContent.trim() === 'Corsi frequentati') {
            item.remove()
        }
        if (item.textContent.trim() === 'Gestione corsi caricati') {
            item.remove()
        }
        if (item.textContent.trim() === 'Carica un corso') {
            item.remove()
        }
        if (item.textContent.trim() === 'Cerca un corso') {
            item.remove()
        }
        if (item.textContent.trim() === 'Gestione corsi caricati') {
            item.remove()
        }
    }

    if (!loggedUser.CorsiPubblicati) {
        if (item.textContent.trim() === 'Gestione corsi caricati') {
            item.remove()
        }
    } else {
        if (item.textContent.trim() === 'Gestione corsi caricati') {
            item.style.display = 'block'
        }
    }

    item.addEventListener('click', function (event) {
        event.preventDefault()
        sidebarContainer.querySelectorAll('li').forEach(function (otherItem) {
            otherItem.classList.remove('active')
        })
        item.classList.add('active')
        const funName = item.textContent.trim()
        switch (funName) {
            case 'Panoramica':
                loadPage(profileSection)
                break
            case 'Corsi frequentati':
                window.location.href = '/courses'
                break
            case 'Cerca un corso':
                loadPage(searchSection)
                mainSection.addEventListener('click', (event) => {
                    if (event.target.closest('#search_course_icon')) {
                        searchCourses()
                    }
                })
                break
            case 'Carica un corso':
                loadPage(uploadSection)
                mainSection.addEventListener('click', (event) => {
                    if (event.target.closest('#uploadButton')) {
                        window.location.href = '/uploadcurse'
                    }
                })
                break
            case 'Gestione corsi caricati':
                window.location.href = '/modify'
                break
        }

    })
})

document.getElementById('logout').addEventListener('click', () => {
    logout()
})

//funzioni per far partire la procedure di modifica di un campo del profilo
//la prima è per la profile pic
mainSection.addEventListener('click', (event) => {
    if (event.target.closest('#profile_pick')) {
        event.preventDefault()
        modProfilePickProcedure()
    }
})
modEmail.addEventListener('click', (e) => {
    e.preventDefault()
    modEmailProcedure()
})
modPassword.addEventListener('click', (e) => {
    e.preventDefault()
    modPasswordProcedure()
})
abortModEmail.addEventListener('click', (e) => {
    e.preventDefault()
    removeBlur(mainSection, sidebar, infoSection)
    modEmailForm.classList.remove('active')
})
abortModPassword.addEventListener('click', (e) => {
    e.preventDefault()
    removeBlur(mainSection, sidebar, infoSection)
    modPasswordForm.classList.remove('active')
})
abortModPick.addEventListener('click', (e) => {
    e.preventDefault()
    removeBlur(mainSection, sidebar, infoSection)
    modProfilePickForm.classList.remove('active')
})
function modEmailProcedure() {
    setBlur(mainSection, sidebar, infoSection)
    modEmailForm.classList.add('active')
}
function modPasswordProcedure() {
    setBlur(mainSection, sidebar, infoSection)
    modPasswordForm.classList.add('active')
}
function modProfilePickProcedure() {
    setBlur(mainSection, sidebar, infoSection)
    modProfilePickForm.classList.add('active')
}

//funzioni per comunicare con il server le modifiche dei campi del profilo e per poi aggiornare tali campi senza refresh
modEmailForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const emailField = document.getElementById('email')
    const confEmailField = document.getElementById('conf_email')
    let formData = new FormData(modEmailForm)
    formData.append('userId', loggedUser.UserId)
    fetch('/profile/api/modEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: formData.get('email'),
            confEmail: formData.get('conf_email'),
            userId: formData.get('userId')
        })
    })
        .then((res) => res.json())
        .then((data) => {
            setSuccess(emailField)
            setSuccess(confEmailField)
            if (data.errors) {
                if (data.errors === 'empty') {
                    setError(emailField, 'Campo obbligatorio')
                } else if (data.errors === 'not email') {
                    setError(emailField, 'Email non valida')
                } else if (data.errors === 'not same') {
                    setError(confEmailField, 'Le due email devono coincidere')
                } else if (data.errors === 'wrong id' || data.errors === 'server error') {
                    databaseError()
                } else {
                    setSuccess(emailField)
                    setSuccess(confEmailField)
                }
            } else if (data.message) {
                removeBlur(mainSection, sidebar, infoSection)
                modEmailForm.classList.remove('active')
                modEmailSuccess.classList.add('active')
                profileSectionEmail.textContent = data.message
                successText(modEmailSuccess)
            }
        })
})
modPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const passField = document.getElementById('password')
    const confPassField = document.getElementById('conf_password')
    let formData = new FormData(modPasswordForm)
    formData.append('userId', loggedUser.UserId)
    fetch('/profile/api/modPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pass: formData.get('password'),
            confPass: formData.get('conf_password'),
            userId: formData.get('userId')
        })
    })
        .then((res) => res.json())
        .then((data) => {
            setSuccess(passField)
            setSuccess(confPassField)
            if (data.errors) {
                if (data.errors === "empty") {
                    setError(passField, "Campo Obbligatorio")
                } else if (data.errors === "La password deve avere almeno 6 caratteri") {
                    setError(passField, "La password deve avere almeno 6 caratteri")
                } else if (data.errors === "La password deve contenere una maiuscola") {
                    setError(passField, "La password deve contenere una maiuscola")
                } else if (data.errors === "La password deve contenere un numero") {
                    setError(passField, "La password deve contenere un numero")
                } else if (data.errors === "Le password devono coincidere") {
                    setError(confPassField, "Le password devono coincidere")
                } else if (data.errors === 'wrong id' || data.errors === 'server error') {
                    databaseError()
                } else {
                    setSuccess(passField)
                    setSuccess(confPassField)
                }
            } else if (data.success) {
                removeBlur(mainSection, sidebar, infoSection)
                modPasswordForm.classList.remove('active')
                modPasswordSuccess.classList.add('active')
                successText(modPasswordSuccess)
            }
        })
        .catch((err) => {
            console.log(err)
        })
})
modProfilePickForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const newProfilePick = document.getElementById('profile_img').files[0]
    let formData = new FormData()
    formData.append('newImg', newProfilePick)
    fetch('/profile/api/modPick', {
        method: 'POST',
        body: formData
    })
        .then((res) => res.json())
        .then((data) => {
            setSuccess(fileSelector)
            if (data.errors) {
                if (data.errors === 'no img') {
                    setError(fileSelector, 'Nessun Immagine caricata')
                } else if (data.errors === 'immagine non valida') {
                    setError(fileSelector, 'Immagine invalida')
                } else if (data.errors === 'server error') {
                    databaseError()
                } else {
                    setSuccess(fileSelector)
                }
            } else if (data.success) {
                modProfilePickForm.classList.remove('active')
                modPicksSuccess.classList.add('active')
                //refresh della pic senza il refresh della pagina, usando un url che forza la pagina a non prendere la foto dalla cache del browser
                let oldSrc = profilePick.src
                profilePick.src = oldSrc + '?reload=' + new Date().getTime()
                removeBlur(mainSection, sidebar, infoSection)
                successText(profilePick)
            }
        })
        .catch((e) => {
            console.log(e)
            databaseError()
        })
})

function loadPage(toLoad) {
    profileSection.classList.remove('active')
    searchSection.classList.remove('active')
    uploadSection.classList.remove('active')
    toLoad.classList.add('active')
}
function searchCourses() {
    let input = document.getElementById('course_search').value
    researchResults.innerHTML = ''
    fetch('/profile/api/searchCourse', {
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
                        window.location.href = `/buy/${course.CourseId}`
                    })
                    count++
                })
            } else if (data.error && data.error === 'no course found') {
                searchFail.classList.add('active')
            } else if (data.error && data.error === 'server error') {
                databaseError()
            }
        })

}
function successText(success) {
    setTimeout(function () {
        success.classList.add('fadeOutText');
        success.classList.remove('active')
        success.classList.remove('fadeOutText')
    }, 3000);
}