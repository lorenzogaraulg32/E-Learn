//logout
import {databaseError} from "./formValidationErrorHandler.js";

export function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/'
            }
        })
        .catch(e => {
            console.log('Error during logout:', e)
            databaseError()
        })
}
