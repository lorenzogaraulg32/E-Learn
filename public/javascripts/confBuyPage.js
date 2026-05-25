setTimeout(function () {
    window.location.href = "/profile"
}, 5000)

document.getElementById('btn').addEventListener('click', (e)=>{
    e.preventDefault()
    window.location.href = "/profile"
})

