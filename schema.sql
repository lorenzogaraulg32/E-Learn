BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "courses" (
	"CourseId"	INTEGER,
	"Nome"	TEXT,
	"Descrizione"	TEXT,
	"Categoria"	TEXT,
	"Professore"	TEXT,
	"Prezzo"	INTEGER,
	"ProfId"	INTEGER,
	"Nlezioni"	INTEGER,
	PRIMARY KEY("CourseId")
);
CREATE TABLE IF NOT EXISTS "lezioni" (
	"IdLezione"	INTEGER,
	"Nome"	TEXT NOT NULL,
	"Descrizione"	TEXT,
	"PercorsoPdf"	TEXT,
	"PercorsoVideo"	INTEGER,
	"IdCorso"	INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "user" (
	"UserId"	INTEGER NOT NULL UNIQUE,
	"Nome"	TEXT NOT NULL,
	"Cognome"	TEXT NOT NULL,
	"Username"	TEXT NOT NULL,
	"Email"	TEXT NOT NULL,
	"Password"	TEXT NOT NULL,
	"CorsiComprati"	TEXT,
	"CorsiPubblicati"	TEXT,
	"ProfilePic"	TEXT,
	PRIMARY KEY("UserId")
);
COMMIT;
