'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const {getCourseInfo} = require("../courses-dao")
const {buyCourse} = require('../user-dao')

let router = express.Router()
router.use(bodyParser.urlencoded({extended: true}))
router.use(express.json());

router.get('/:courseId', (req, res) => {
    res.render('../views/buyPage')
})


router.get('/api/courses/:courseId', async (req, res) => {
    const courseId = req.params.courseId
    let course = await getCourseInfo(courseId)
    res.json(course)
})

router.post('/:courseId', async (req, res) => {
    const validationErrors = []

    let fullname = req.body.nome
    let cardNum = req.body.num
    let date = req.body.exp_date
    let cvv = req.body.cvv

    const checkFields = (field, element, max, min) => {
        switch (true) {
            case (!field):
                validationErrors.push({message: element + ' empty'})
                break
            case (field.length < min):
                validationErrors.push({message: element + ' too short'})
                break
            case (field.length > max):
                validationErrors.push({message: element + ' too long'})
                break
        }
    }
    checkFields(fullname, 'name', 50, 3)
    checkFields(cardNum, 'cardNum', 19, 19)
    checkFields(date, 'data', 9999, 0)
    checkFields(cvv, 'cvv', 3, 3)

    if (validationErrors.length > 0) {
        res.status(422).json({error: validationErrors})
    } else {
        const courseId = req.params.courseId
        const user = req.user
        buyCourse(courseId, user)
            .then(_ => {
                res.status(200).json({success: true})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error: 'Database error'})
            })
    }
})


module.exports = router