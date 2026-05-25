const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const userDAO = require('./user-dao')

module.exports = {
    isAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/login')
    },

    isNotAuth: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next()
        }
        res.redirect('/profile')
    },

    initPassport(passport) {
        passport.use(new LocalStrategy({usernameField: 'email'}, async function authUser(email, password, done) {
            try {
                const user = await userDAO.getUserForLogin(email)
                if (!user) {
                    return done(null, false, {message: 'User not found'})
                }
                if (await bcrypt.compare(password, user.Password)) {
                    return done(null, user)
                } else if (password === '') {
                    console.log('pass empty')
                    return done(null, false, {message: 'Wrong password'})
                } else{
                    return done(null, false, {message: 'Wrong password'})
                }
            } catch (e) {
                console.log('here2')
                console.error(e)
                return done(e, false, {message: 'An error occurred while processing your request'})
            }
        }))


        passport.serializeUser((user, done) => {
            done(null, user.UserId)
        })

        passport.deserializeUser(async (id, done) => {
            try {
                const user = await userDAO.getUserForDeserialize(id)
                if (!user) {
                    done(null, false)
                } else {
                    done(null, user)
                }
            } catch (err) {
                console.log("Error deserializing user:", err)
                done(err, null)
            }
        })
    }
}