'use strict'

require('dotenv').config()

//import
const express = require('express')
const session = require('express-session')
const path = require('path')
const passport = require('passport')

const app = express()
const port = 3000

//middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//init di passport
const passport_conf = require('./passportConfig')
passport_conf.initPassport(passport)
//passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'development_secret',
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    next()
})

const registerRoute = require('./routes/registerRoute')
const loginRoute = require('./routes/loginRoute')
const profileRoute = require('./routes/profileRoute')
const coursesRoute = require('./routes/coursePageRoute')
const uploadCourseRoute = require('./routes/uploadCourseRoute')
const buyRoute = require('./routes/buyCourseRoute')
const modRoute = require('./routes/modCourseRoute')
const {getCourseByName} = require("./courses-dao")
//routes
//per le route "/", login e register non devi essere autenticato, se sei autenticato allora vieni ridiretto alla profilePage
app.get('/', passport_conf.isNotAuth, (req, res) => {
    res.render(path.join(__dirname, 'views/start'))
})

//in questo caso lo spazio vuoto restituirà i primi 100 corsi trovati
app.post('/searchCoursesStart', passport_conf.isNotAuth, async (req, res) => {
    const input = req.body.searchInput.trim()
    const searchResult = []
    getCourseByName(input)
        .then((queryResult) => {
            if (input === '') {
                let count = 1
                for (const result of queryResult) {
                    if(count >= 100) break;
                    searchResult.push(result)
                    count ++
                }
            }else{
                for (const result of queryResult) {
                    searchResult.push(result)
                }
            }
            if (searchResult.length > 0) {
                return res.status(200).json({courses: searchResult})
            } else {
                return res.status(404).json({error: 'no course found'})
            }
        })
        .catch((e) => {
            console.log(e)
            return res.status(500).json({error: 'server error'})
        })


})

app.get('/buyConf', passport_conf.isAuth, (req, res) => {
    res.render(path.join(__dirname, 'views/buyConfPage'))
})

app.use('/register', passport_conf.isNotAuth, registerRoute)

app.use('/login', passport_conf.isNotAuth, loginRoute)

app.use('/profile', passport_conf.isAuth, profileRoute)

app.use('/courses', passport_conf.isAuth, coursesRoute)

app.use('/uploadcurse', passport_conf.isAuth, uploadCourseRoute)

app.use('/buy', passport_conf.isAuth, buyRoute)

app.use('/modify', passport_conf.isAuth, modRoute)

app.post('/logout', passport_conf.isAuth, (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err)
            return res.sendStatus(500)
        }
        return res.sendStatus(200)
    })
})

app.listen(port, () => {
    console.log("App listening on port " + port)
})