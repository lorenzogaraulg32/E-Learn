'use strict'

const {check, validationResult} = require('express-validator')
const express = require('express')
const {checkIfUsernameAlreadyExists, checkIfEmailAlreadyExists, addUserToDB} = require("../user-dao")

let router = express.Router()


router.route('/')
    .get((req, res) => {
        res.render('../views/register')
    })
    .post([
        check('nome', 'Campo Nome incorretto')
            .trim()
            .exists()
            .isLength({min: 3, max: 20})
            .isAlpha(),
        check('cognome', 'Campo cognome incorretto')
            .trim()
            .exists()
            .isLength({min: 3, max: 20})
            .isAlpha(),
        check('username', 'Campo username incorretto')
            .trim()
            .exists()
            .isLength({min: 3, max: 20}),
        check('email', 'Campo email incorretto')
            .trim()
            .exists()
            .isEmail(),
        check('password', 'Campo password incorretto')
            .trim()
            .exists()
            .custom(pass => {
                return /[A-Z]/.test(pass) && /[0-9]/.test(pass)
            }),
        check('passwordC')
            .trim()
            .exists().withMessage("è vuoto")
            .custom((confPassword, {req}) => {
                return req.body.confPassword === req.body.password
            }).withMessage("Pass non coincidono")
    ], async (req, res) => {

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const usernameExists = await checkIfUsernameAlreadyExists(req.body.username)
                .catch(() => res.status(500).json({error: 'Database error during the signup'}))
            if (usernameExists) {
                return res.status(422).json({error: 'Username'})
            }
            const emailExist = await checkIfEmailAlreadyExists(req.body.email)
                .catch(() => res.status(500).json({error: 'Database error during the signup'}))
            if (emailExist) {
                return res.status(422).json({error: 'Email'})
            }
            const user = {
                nome: req.body.nome,
                cognome: req.body.cognome,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
            addUserToDB(user)
                .then(() => res.status(200).json({success: true}))
                .catch(() => res.status(500).json({error: 'Database error during the signup'}))
        } else {
            console.log(errors.array())
            res.status(422).json({error: 'Validation failed'})
        }
    })

module.exports = router