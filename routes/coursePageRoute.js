'use strict'

const express = require('express')
const {getUserSubCourses} = require('../user-dao')
const {getCourseInfo} = require("../courses-dao")
const {getCourseLessons} = require('../lesson-dao')
let router = express.Router()

router.get('/', (req, res) => {
    res.render('../views/coursePage')
})

router.get('/api/courses', async (req, res) => {
    const courses = await getUserSubCourses(req.user)
    if(courses) {
        let coursesArray = []
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i]
            const c = await getCourseInfo(course)
            const lessons = await getCourseLessons(c.CourseId)
            const courseObj = {
                nome: c.Nome || null,
                descrizione: c.Descrizione || null,
                professore: c.Professore || null,
                profId: c.ProfId || null,
                categoria: c.Categoria || null,
                lezioni: lessons || null,
            }
            coursesArray.push(courseObj)
        }
        res.json(coursesArray)
    }else{
        res.json(null)
    }
})

router.get('/api/user', async (req, res) => {
    res.json(req.user)
})

module.exports = router