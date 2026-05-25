'use strict'

const express = require('express')
const passport = require("passport")

let router = express.Router()


router.route('/')
    .get((req, res) => {
        res.render('../views/login')
    })
    .post((req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/home',
        }, async (err, user, info) => {
            if (err) {
                console.error(err)
                return res.status(500).json({error: 'error'})
            }
            if (!user) {
                if (info.message === 'User not found') {
                    return res.status(422).json({error: 'User not found'})
                } else if (info.message === 'Wrong password') {
                    return res.status(422).json({error: 'Wrong password'})
                } else if (info.message === 'An error occurred while processing your request') {
                    return res.status(500).json({error: 'Database error'})
                } else {
                    return res.status(422).json({error: 'Missing credentials'})
                }
            }
            req.logIn(user, function (err) {
                if (err) {
                    console.error(err)
                    return res.status(500).json({error: 'Validation failed'})
                }
                return res.status(200).json({success: true})
            })
        })(req, res, next)
    })

module.exports = router