# E-Learn

## English

E-Learn is a full-stack web application developed as a university project.

The goal of the project was to build an online learning platform where users can register, log in, browse available courses, purchase courses through a simulated payment flow, publish their own courses, and manage educational content.

The system supports authenticated user sessions, course publishing, course purchasing, user profiles, and lesson management with PDF and video materials.

### Main Features

- User registration and login
- Authentication with Passport.js local strategy
- Password hashing with bcrypt
- User profile management
- Course search
- Course publishing
- Course purchase flow
- Management of purchased courses
- Management of published courses
- Upload of course lessons
- Upload and validation of PDF and video files
- Course and lesson editing
- Course and lesson removal
- Server-side validation
- SQLite-based persistence

### Technologies Used

- Node.js
- Express.js
- JavaScript
- HTML
- CSS
- EJS
- Passport.js
- bcrypt
- SQLite
- express-session
- express-validator
- express-fileupload
- dotenv

### Project Structure

The backend is organized using route modules and DAO files:

- `app.js`: main Express application configuration
- `passportConfig.js`: Passport authentication configuration
- `db.js`: SQLite database connection
- `user-dao.js`: user-related database operations
- `courses-dao.js`: course-related database operations
- `lesson-dao.js`: lesson-related database operations
- `routes/`: application routes
- `views/`: EJS templates
- `public/`: static frontend assets and uploaded course files
- `schema.sql`: database schema used to recreate the SQLite database structure

### Configuration

For security and portability reasons, sensitive or environment-specific files are not included in this repository.

The project uses environment variables for local configuration.  
Create a `.env` file in the project root using `.env.example` as a reference.

Example:

```env
SESSION_SECRET=your_session_secret
DB_PATH=ProjectDB.db
```

The real `.env` file must not be committed to the repository.

### Database Setup

The real SQLite database file is not included in this repository for privacy and portability reasons.

A database schema is provided in:

```text
schema.sql
```

To recreate the database locally, run:

```bash
sqlite3 ProjectDB.db < schema.sql
```

Alternatively, the schema can be imported using DB Browser for SQLite.

The application expects a SQLite database compatible with the provided schema.

### Security Notes

The project does not include real secrets, local environment files, uploaded course materials, or the local database file.

The following files and folders are intentionally excluded from version control:

- `.env`
- `ProjectDB.db`
- `node_modules/`
- `public/corsi/`
- `public/profilePics/`

### Project Status

This project was developed as a university project.  
The codebase reflects the structure and development practices used at the time.

Some parts of the application may require local configuration, database setup, dependency installation, or minor adjustments before running correctly in a new environment.


---

## Italiano

E-Learn è un’applicazione web full-stack sviluppata come progetto universitario.

L’obiettivo del progetto era realizzare una piattaforma per corsi online, in cui gli utenti potessero registrarsi, effettuare il login, cercare corsi disponibili, acquistare corsi tramite un flusso di pagamento simulato, pubblicare i propri corsi e gestire i contenuti didattici.

Il sistema supporta sessioni utente autenticate, pubblicazione dei corsi, acquisto dei corsi, gestione del profilo e gestione delle lezioni con materiali PDF e video.

### Funzionalità principali

- Registrazione e login degli utenti
- Autenticazione tramite Passport.js local strategy
- Hashing delle password con bcrypt
- Gestione del profilo utente
- Ricerca dei corsi
- Pubblicazione di corsi
- Flusso di acquisto dei corsi
- Gestione dei corsi acquistati
- Gestione dei corsi pubblicati
- Upload delle lezioni
- Upload e validazione di file PDF e video
- Modifica di corsi e lezioni
- Rimozione di corsi e lezioni
- Validazione server-side
- Persistenza basata su SQLite

### Tecnologie utilizzate

- Node.js
- Express.js
- JavaScript
- HTML
- CSS
- EJS
- Passport.js
- bcrypt
- SQLite
- express-session
- express-validator
- express-fileupload
- dotenv

### Struttura del progetto

Il backend è organizzato tramite moduli di route e file DAO:

- `app.js`: configurazione principale dell’applicazione Express
- `passportConfig.js`: configurazione dell’autenticazione con Passport
- `db.js`: connessione al database SQLite
- `user-dao.js`: operazioni sul database relative agli utenti
- `courses-dao.js`: operazioni sul database relative ai corsi
- `lesson-dao.js`: operazioni sul database relative alle lezioni
- `routes/`: route dell’applicazione
- `views/`: template EJS
- `public/`: asset statici frontend e file caricati per i corsi
- `schema.sql`: schema utilizzato per ricreare la struttura del database SQLite

### Configurazione

Per motivi di sicurezza e portabilità, i file sensibili o legati all’ambiente locale non sono inclusi in questo repository.

Il progetto utilizza variabili d’ambiente per la configurazione locale.  
Creare un file `.env` nella root del progetto utilizzando `.env.example` come riferimento.

Esempio:

```env
SESSION_SECRET=your_session_secret
DB_PATH=ProjectDB.db
```

Il file `.env` reale non deve essere caricato nel repository.

### Setup del database

Il file reale del database SQLite non è incluso nel repository per motivi di privacy e portabilità.

Lo schema del database è disponibile in:

```text
schema.sql
```

Per ricreare il database in locale, eseguire:

```bash
sqlite3 ProjectDB.db < schema.sql
```

In alternativa, lo schema può essere importato utilizzando DB Browser for SQLite.

L’applicazione si aspetta un database SQLite compatibile con lo schema fornito.

### Note sulla sicurezza

Il progetto non include segreti reali, file di ambiente locali, materiali dei corsi caricati dagli utenti o il file locale del database.

I seguenti file e cartelle sono intenzionalmente esclusi dal versionamento:

- `.env`
- `ProjectDB.db`
- `node_modules/`
- `public/corsi/`
- `public/profilePics/`


### Stato del progetto

Il progetto è stato sviluppato come progetto universitario.  
La struttura del codice riflette le pratiche e l’organizzazione adottate durante lo sviluppo originale.

Alcune parti dell’applicazione potrebbero richiedere configurazione locale, setup del database, installazione delle dipendenze o piccoli adattamenti prima di funzionare correttamente in un nuovo ambiente.
