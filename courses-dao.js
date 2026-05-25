'use strict'
const db = require('./db.js')
const {getUserPubCourses, getUserSubCourses} = require("./user-dao");

exports.addNewCourse = function (course) {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO courses(CourseId, Nome, Descrizione, Categoria, Professore, Prezzo, ProfId, Nlezioni) VALUES(?,?,?,?,?,?,?,?)'
        db.run(query, [course.id, course.nome, course.descrizione, course.categoria, course.prof, course.prezzo, course.profid, course.nlez], (err => {
            if (err) {
                reject("Errore caricamento corso" + err.message)
            } else {
                resolve()
            }
        }))
    })
}


exports.getAllCourses = function () {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM courses'
        db.all(query, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

exports.getCourseInfo = function (courseId) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM courses WHERE CourseId = ?'
        db.get(query, [courseId], (err, row) => {
            if (err) {
                reject(err)
            } else if (row) {
                resolve(row)
            } else {
                reject('Course not found')
            }
        })
    })

}


exports.getCourseByName = function (courseName) {
    return new Promise((resolve, reject) => {
        let pattern = '%' + courseName + '%'
        let query = 'SELECT * FROM courses WHERE Nome LIKE ?'
        db.all(query, [pattern], (err, rows) => {
            if (err) {
                reject(err)
            } else if (rows) {
                resolve(rows)
            } else {
                reject('the course has no lessons')
            }
        })
    })

}

exports.updateCourseLessonNumber = function (nLez, courseId){
    return new Promise((resolve, reject) => {
        let query = 'UPDATE courses SET nLezioni = ? WHERE CourseId = ?'
        db.run(query, [nLez, courseId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.updateCourseName = function (nome, courseId) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE courses SET Nome = ? WHERE CourseId = ?'
        db.run(query, [nome, courseId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.updateCourseDescription = function (desc, courseId) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE courses SET Descrizione = ? WHERE CourseId = ?'
        db.run(query, [desc, courseId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.updateCoursePrice = function (price, courseId) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE courses SET Prezzo = ? WHERE CourseId = ?'
        db.run(query, [price, courseId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.updateCourseCategory = function (category, courseId) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE courses SET Categoria = ? WHERE CourseId = ?'
        db.run(query, [category, courseId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.deleteCourse = function (courseId) {
    return new Promise((resolve, reject) => {
        let query = 'DELETE FROM courses  WHERE CourseId = ?'
        db.run(query, [courseId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.deleteCourseFromComprati = function (courseId) {
    return new Promise(async (resolve, reject) => {
        let query1 = 'SELECT * FROM user'
        await db.all(query1, async (err, rows) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                for (const user of rows) {
                    let tokens = await getUserSubCourses(user)
                    console.log(tokens)
                    let coursesString = ''
                    if (tokens !== null) {
                        tokens.forEach((token) => {
                            if (token !== courseId) {
                                if (coursesString !== '') {
                                    coursesString += ', '
                                }
                                coursesString += token
                            }
                        })
                    }
                    let query = 'UPDATE user SET CorsiComprati = ? WHERE UserId = ?'
                    db.run(query, [coursesString, user.UserId], (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    })

                }
            }
        })
    })
}

exports.deleteCourseFromPubblicati = function (courseId, user) {
    return new Promise(async (resolve, reject) => {
        let tokens = await getUserPubCourses(user)
        let coursesString = ''
        if (tokens !== null) {
                tokens.forEach((token) => {
                    if (token !== courseId) {
                        if (coursesString !== '') {
                            coursesString += ', '
                        }
                        coursesString += token
                    }
                })
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


