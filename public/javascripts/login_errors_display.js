const form = document.getElementById("form")
const email = document.getElementById("email")
const password = document.getElementById("password")
import {databaseError, setError, setSuccess} from '/javascripts/miscJs/formValidationErrorHandler.js'

form.addEventListener('submit', e => {
        e.preventDefault()
        const formData = new FormData(form)
        const checks = validateInputs()
        if (checks) {
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password'),
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    setSuccess(email)
                    setSuccess(password)
                    if (data.error === 'User not found') {
                        setError(email, "Nessun account con questa mail")
                    } else if (data.error === 'Authentication failed') {
                        setError(password, 'Authentication failed')
                    } else if (data.error === 'Wrong password') {
                        setError(password, "Password incorretta")
                    } else if(data.error === 'Missing credentials') {
                        setError(password, 'Alcuni campi sono vuoti')
                    } else if (data.error === 'Validation failed' || data.error === 'Database error') {
                        databaseError()
                    } else if (data.success) {
                        window.location.href = '/profile'
                    }
                })
                .catch((e) => {
                    console.log('error' + e)
                    databaseError()
                })
        }
    });

function validateInputs() {
        const emailValue = email.value.trim()
        let checkEmail = true

        if (emailValue === '') {
            checkEmail = false
            setError(email, "Nessuna email inserita")
        } else {
            setSuccess(email)
        }

        return checkEmail
    }
