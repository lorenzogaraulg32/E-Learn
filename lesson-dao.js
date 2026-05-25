'use strict'
const db = require('./db.js')

exports.addNewLesson = function (lesson, courseId) {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO lezioni(IdLezione, Nome, Descrizione, PercorsoPdf, PercorsoVideo, IdCorso) VALUES(?,?,?,?,?,?)'
        db.run(query, [lesson.id, lesson.nome, lesson.descrizione, lesson.pdf, lesson.video, courseId], (err => {
            if (err) {
                reject("Errore caricamento Lezioni" + err.message)
            } else {
                resolve()
            }
        }))
    })
}


exports.getLessonById = function (lessonId) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM lezioni WHERE IdLezione = ?'
        db.get(query, [lessonId], (err, row) => {
            if (err) {
                reject(err)
            } else if (row) {
                resolve(row)
            } else {
                reject('lesson not found [id]' + lessonId)
            }
        })
    })
}


exports.getCourseLessons = function (courseId) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM lezioni WHERE IdCorso = ?'
        db.all(query, [courseId], (err, rows) => {
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

exports.updateLessonName = function (nome, lessonId) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE lezioni SET Nome = ? WHERE IdLezione = ?'
        db.run(query, [nome, lessonId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.updateLessonDesc = function (descrizione, lessonId) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE lezioni SET Descrizione = ? WHERE IdLezione = ?'
        db.run(query, [descrizione, lessonId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.updateLessonPdf = function (pdf, lessonId) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE lezioni SET PercorsoPdf = ? WHERE IdLezione = ?'
        db.run(query, [pdf, lessonId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.updateLessonVideo = function (video, lessonId) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE lezioni SET PercorsoVideo = ? WHERE IdLezione = ?'
        db.run(query, [video, lessonId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.deleteLesson = function ( lessonId) {
    return new Promise((resolve, reject) => {
        let query = 'DELETE FROM lezioni  WHERE IdLezione = ?'
        db.run(query, [lessonId], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}