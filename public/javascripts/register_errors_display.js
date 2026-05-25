const form = document.getElementById("form")
const name = document.getElementById("nome")
const username = document.getElementById("username")
const surname = document.getElementById("cognome")
const email = document.getElementById("email")
const password = document.getElementById("password")
const confPassword = document.getElementById("passwordC")
import {
    databaseError,
    hasNumber,
    hasUppercase,
    isValidEmail,
    onlyLetters,
    setError,
    setSuccess
} from '/javascripts/miscJs/formValidationErrorHandler.js'

//event listener che previene il default behavihour e usa ajax per la gestione della validazione server side(username e email)
form.addEventListener('submit', e => {
    e.preventDefault()
    let checks = valideInputs()
    if (checks) {
        const formData = new FormData(form)
        //ajax per assicurare che no esistano username/email duplicati
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: formData.get('nome'),
                cognome: formData.get('cognome'),
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                confPassword: formData.get('passwordC')
            })
        })
            .then((res) => res.json())
            .then((data) => {
                setSuccess(email)
                setSuccess(username)
                setSuccess(password)
                setSuccess(confPassword)
                setSuccess(surname)
                setSuccess(name)
                if (data.error === 'Username') {
                    setError(username, "Username già esistente")
                } else if (data.error === 'Email') {
                    setError(email, "Email già esistente")
                } else if (data.error === 'Validation failed' || data.error === 'Database error') {
                    databaseError()
                } else if (data.success) {
                    window.location.href = '/login'
                }
            })
            .catch( e => {
                console.log(e)
                databaseError()
            })

    }
})

//funzione per la validazione client-side
function valideInputs() {
    //recupero il value degli elementi del form
    const nameValue = name.value.trim()
    const surnameValue = surname.value.trim()
    const usernameValue = username.value.trim()
    const emailValue = email.value.trim()
    const passwordValue = password.value.trim()
    const confPasswordValue = confPassword.value.trim()

    let checkNome = false
    let checkCognome = false
    let checkUsername = false
    let checkEmail = false
    let checkPass = false
    let checkConfPass = false

    //check nome
    if (nameValue === "") {
        setError(name, "Campo Obbligatorio")
    } else if (!onlyLetters(nameValue)) {
        setError(name, "Il nome non può contenere numeri/caratteri speciali")
    } else if (nameValue.length < 3) {
        setError(name, "Il nome deve avere almeno 3 caratteri")
    } else if (nameValue.length > 20) {
        setError(name, "Il nome deve avere al massimo 20 caratteri")
    } else {
        setSuccess(name)
        checkNome = true
    }

    //check cognome
    if (surnameValue === "") {
        setError(surname, "Campo Obbligatorio")
    } else if (!onlyLetters(surnameValue)) {
        setError(surname, "Il cognome non può contenere numeri/caratteri speciali")
    } else if (surnameValue.length < 3) {
        setError(surname, "Il cognome deve avere almeno 3 caratteri")
    } else if (surnameValue.length > 20) {
        setError(surname, "Il cognome deve avere al massimo 20 caratteri")
    } else {
        setSuccess(surname)
        checkCognome = true
    }

    //check username
    if (usernameValue === "") {
        setError(username, "Campo Obbligatorio")
    } else if (usernameValue.length < 3) {
        setError(username, "L'username deve avere almeno 3 caratteri")
    } else if (usernameValue.length > 20) {
        setError(username, "L'username deve avere al massimo 20 caratteri")
    } else {
        setSuccess(username)
        checkUsername = true
    }

    if (emailValue === "") {
        setError(email, "Campo Obbligatorio")
    } else if (!isValidEmail(emailValue)) {
        setError(email, "Formato email non valido")
    } else {
        setSuccess(email)
        checkEmail = true
    }

    //checkPassword
    //una maiuscola, un numero, min sei char
    if (passwordValue === '') {
        setError(password, "Campo Obbligatorio")
    } else if (passwordValue.length < 6) {
        setError(password, "La password deve avere almeno 6 caratteri")
    } else if (!hasUppercase(passwordValue)) {
        setError(password, "La password deve contenere una maiuscola")
    } else if (!hasNumber(passwordValue)) {
        setError(password, "La password deve contenere un numero")
    } else {
        setSuccess(password)
        checkPass = true
    }

    //check password coincidono
    if (passwordValue !== confPasswordValue) {
        setSuccess(password)
        setError(confPassword, "Le due password devono essere uguali")
    } else if (confPasswordValue !== "" && passwordValue === confPasswordValue) {
        setSuccess(confPassword)
        checkConfPass = true
    }
    return checkNome && checkCognome && checkUsername && checkEmail && checkPass && checkConfPass

}

