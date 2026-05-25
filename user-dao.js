'use strict'
const db = require('./db.js')
const bcrypt = require('bcrypt')

//Database-Access-Object per gli user
exports.getUserSubCourses = function (user) {
    if (user.CorsiComprati) {
        let tokens = user.CorsiComprati.split(',')
        return tokens
    } else {
        return null
    }
}

function getUserSubCourses(user) {
    if (user.CorsiComprati) {
        let tokens = user.CorsiComprati.split(',')
        return tokens
    } else {
        return null
    }
}

exports.getUserPubCourses = function (user) {
    if (user.CorsiPubblicati) {
        let tokens = user.CorsiPubblicati.split(',')
        return tokens
    } else {
        return null
    }
}

function getUserPubCourses(user) {
    if (user.CorsiPubblicati) {
        let tokens = user.CorsiPubblicati.split(',')
        return tokens
    } else {
        return null
    }
}

exports.addUserToDB = function (user) {
    let id = Date.now().toString()
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO user(UserId, Nome, Cognome, Username, Email, Password, CorsiComprati, CorsiPubblicati, ProfilePic) VALUES(?,?,?,?,?,?,?,?)'
        bcrypt.hash(user.password, 10)
            .then((hash) => {
                db.run(query, [id, user.nome, user.cognome, user.username, user.email, hash, '', '', ''], (err => {
                    if (err) {
                        reject("Errore caricamento utente" + err.message)
                    } else {
                        resolve()
                    }
                }))
            })
            .catch((err) => {
                reject("Errore hashing : " + err)
            })
    })
}

exports.checkIfUsernameAlreadyExists = function (username) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM user WHERE username = ? COLLATE NOCASE'
        db.all(query, [username], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows.length > 0)
            }
        })
    })
}

exports.checkIfEmailAlreadyExists = function (email) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM user WHERE Email = ? COLLATE NOCASE'
        db.all(query, [email], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows.length > 0)
            }
        })
    })
}

exports.getUserForLogin = function (email) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM user WHERE Email = ?'
        db.get(query, [email], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

exports.getUserForDeserialize = function (id) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM user WHERE userId = ?'
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}


exports.buyCourse = function (courseId, user) {
    return new Promise(async (resolve, reject) => {
        let tokens = await getUserSubCourses(user)
        let coursesString = ''
        if (tokens === null) {
            coursesString = courseId
        } else {
            tokens.push(courseId)
            tokens.forEach((token, index) => {
                coursesString += token;
                if (index < tokens.length - 1) {
                    coursesString += ',';
                }
            });
        }
        let query = 'UPDATE user SET CorsiComprati = ? WHERE UserId = ?'
        db.run(query, [coursesString, user.UserId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })


    })
}


exports.publishCourse = function (courseId, user) {
    return new Promise(async (resolve, reject) => {
        let tokens = await getUserPubCourses(user)
        let coursesString = ''
        if (tokens === null) {
            coursesString = courseId
        } else {
            tokens.push(courseId)
            tokens.forEach((token, index) => {
                coursesString += token;
                if (index < tokens.length - 1) {
                    coursesString += ',';
                }
            });
        }
        let query = 'UPDATE user SET CorsiPubblicati = ? WHERE UserId = ?'
        db.run(query, [coursesString, user.UserId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })

    })
}

exports.modEmail = function (email, userId) {
    return new Promise(async (resolve, reject) => {
        let query = 'UPDATE user SET Email = ? WHERE UserId = ?'
        db.run(query, [email, userId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.modPassword = function (password, userId) {
    return new Promise(async (resolve, reject) => {
        let query = 'UPDATE user SET Password = ? WHERE UserId = ?'
        bcrypt.hash(password, 10)
            .then((hash) => {
                db.run(query, [hash, userId], (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            })
            .catch((err) => {
                reject(err)
            })
    })
}

exports.modImg = function (img, userId) {
    return new Promise(async (resolve, reject) => {
        let query = 'UPDATE user SET profilePic = ? WHERE UserId = ?'
        db.run(query, [img, userId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}




