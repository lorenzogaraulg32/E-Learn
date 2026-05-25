'use strict'

const express = require('express')
const {getUserForDeserialize, getUserSubCourses, getUserPubCourses, modEmail, modPassword, modImg} = require('../user-dao')
const bodyParser = require('body-parser')
const {getCourseByName, getCourseInfo} = require("../courses-dao")
const fileUpload = require("express-fileupload");
const {isFile} = require("../validationsServerSide");
let router = express.Router()
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())
const path = require('path')
const fs = require("fs");


router.get('/:profId?', async (req, res) => {
    res.render('../views/profile')
})

router.get('/api/prof/:profId', async (req, res) => {
    let prof
    const profId = req.params.profId
    prof = await getUserForDeserialize(profId)
    if (prof) {
        prof.Password = ''
    } else {
        prof = req.user
        prof.Password = ''
    }
    res.json(prof)
})

router.get('/api/user', async (req, res) => {
    const user = req.user
    console.log(req.user)
    user.Password = ''
    res.json(user)
})

router.post('/api/searchCourse', async (req, res) => {
    const input = req.body.searchInput
    input.trim()
    console.log(input)
    if (input === '') {
        console.log('Nessun corso trovato')
        return res.status(404).json({message: 'no corsi found'})
    } else {
        try {//filtro la ricerca fra i corsi comprati e quelli pubblicati dall'utente che esegue la ricerca
            const searchResult = []
            const queryResult = await getCourseByName(input)
            const tokenToFilter1 = await getUserSubCourses(req.user)
            const tokenToFilter2 = await getUserPubCourses(req.user)
            let found = false
            for (const result of queryResult) {
                if (tokenToFilter1) {
                    for(const token of tokenToFilter1) {
                        let c = await getCourseInfo(token)
                        if (c.CourseId === result.CourseId) {
                            found = true
                            break
                        }
                    }
                }
                if (tokenToFilter2) {
                    for(const token of tokenToFilter2) {
                        let c = await getCourseInfo(token)
                        if (c.CourseId === result.CourseId) {
                            found = true
                            break

                        }
                    }
                }
                if (!found) {
                    searchResult.push(result)
                }
                found = false
            }
            if (searchResult.length > 0) {
                return res.status(200).json({courses: searchResult})
            } else {
                return res.status(404).json({error: 'no course found'})
            }
        }catch (e) {
            console.log(e)
            return res.status(500).json({error: 'server error'})
        }
    }
})

router.post('/api/modEmail', async (req, res) => {
    const email = req.body.email.trim()
    const confEmail = req.body.confEmail.trim()
    const userId =parseInt(req.body.userId)
    if (!email) {
        return res.status(422).json({errors: 'empty'})
    } else if (!isValidEmail(email)) {
        return res.status(422).json({errors: 'not email'})
    } else if (email !== confEmail) {
        return res.status(422).json({errors: 'not same'})
    } else if (req.user.UserId !== userId) {
        return res.status(500).json({errors: 'wrong id'})
    } else {
        await modEmail(email,userId)
            .then(() => {
                return res.status(200).json({message: email})
            })
            .catch((error) => {
                console.log(error)
                return res.status(500).json({errors: 'server error'})
            })
    }
})

router.post('/api/modPick', fileUpload({debug: true}) ,async (req, res) => {
    let img
    const pathToSave = '/profilePics/'
    if(req.files){
        img = req.files['newImg']
        if(!(isFile(img, '.jpg') || isFile(img, '.png') || isFile(img, '.jpeg'))){
            return res.status(422).json({errors: 'immagine non valida'})
        }else {
            if (!req.user.ProfilePick) {
                const imgPath = path.join(__dirname, '../public', pathToSave, req.user.UserId.toString() + '.png')
                await img.mv(imgPath)
                    .then(async () => {
                        await modImg('yes', req.user.UserId)
                        return res.status(200).json({success: true})
                    })
                    .catch((err) => {
                        console.log(err)
                        return res.status(500).json({errors: 'server error'})

                    })
            } else {
                const imgPath = path.join(__dirname, '../public', pathToSave, req.user.UserId.toString() + '.png')
                fs.unlink(imgPath, async err => {
                    if (err) {
                        console.log('error deleting img ', err)
                        return res.status(500).json({errors: 'server error'})
                    } else {
                        await img.mv(imgPath)
                            .then(async () => {
                                await modImg('yes', req.user.UserId)
                                return res.status(200).json({success: true})
                            })
                            .catch((err) => {
                                console.log(err)
                                return res.status(500).json({errors: 'server error'})
                            })
                    }
                })
            }
        }
    }else{
        return res.status(422).json({errors: 'no img'})
    }
})

router.post('/api/modPassword', async (req, res) => {
    const password = req.body.pass.trim()
    const confPassword = req.body.confPass.trim()
    const userId = parseInt(req.body.userId)
    if (!password) {
        return res.status(422).json({errors: 'empty'})
    } else if (password.length < 6) {
        return res.status(422).json({errors: 'La password deve avere almeno 6 caratteri'})
    } else if (!hasUppercase(password)) {
        return res.status(422).json({errors: 'La password deve contenere una maiuscola'})
    } else if (!hasNumber(password)) {
        return res.status(422).json({errors: 'La password deve contenere un numero'})
    } else if (password !== confPassword) {
        return res.status(422).json({errors: 'Le password devono coincidere'})
    } else if (req.user.UserId !== userId) {
        return res.status(500).json({errors: 'wrong id'})
    } else {
        await modPassword(password, userId)
            .then(() => {
                return res.status(200).json({success: true})
            })
            .catch((error) => {
                console.log(error)
                return res.status(500).json({errors: 'server error'})
            })
    }
})


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function hasUppercase(str) {
    return /[A-Z]/.test(str)
}

function hasNumber(str) {
    return /[0-9]/.test(str)
}

module.exports = router