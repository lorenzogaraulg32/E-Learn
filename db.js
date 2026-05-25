'use strict'
require('dotenv').config()

const sqlite = require('sqlite3')

const dbPath = process.env.DB_PATH || 'ProjectDB.db'

const db = new sqlite.Database(dbPath, (err) => {
   if (err) throw err
   console.log("Database connesso con successo")
})

module.exports = db