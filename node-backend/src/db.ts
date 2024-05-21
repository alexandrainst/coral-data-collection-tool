import { Database, default as SQLiteDatabase } from 'better-sqlite3'
import { copyFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { ensureDataDir, log } from './util'

function createConn(dbPath: string): Database {
  const conn = new SQLiteDatabase(dbPath, { fileMustExist: true })
  conn.pragma('foreign_keys = ON')
  return conn
}

let dbPath: string
let dbConn: Database
export function getDB(): Database {
  if (!dbPath) {
    log('Ensuring DB PATH')
    const dataPath = ensureDataDir()
    dbPath = join(dataPath, 'db.sqlite')
    if (!existsSync(dbPath)) {
      log('Creating DB from fixtures')
      copyFileSync(resolve(dataPath, 'fixtures/sentences.sqlite'), dbPath)
    }
  }

  if (!dbConn) {
    log('Creating connection')
    dbConn = createConn(dbPath)
    log('Ensuring fixture tables exist')
    dbConn
      .prepare(
        `CREATE TABLE IF NOT EXISTS "speakers" (
        "id_speaker"	    text,
        "name"            text NOT NULL,
        "email"           text NOT NULL,
        "age"	            integer NOT NULL,
        "gender"	        text NOT NULL,
        "dialect"	        text NOT NULL,
        "language_native"	text NOT NULL,
        "language_spoken"	text NOT NULL,
        "zip_school"	    text NOT NULL,
        "zip_birth"	      text NOT NULL,
        "country_birth"	  text NOT NULL,
        "education"	      text NOT NULL,
        "occupation"	    text NOT NULL,
        "split"	          text,
        PRIMARY KEY ("id_speaker")
      )`
      )
      .run()
    dbConn
      .prepare(
        `CREATE TABLE IF NOT EXISTS "recordings" (
        "id_recording"	  text,
        "id_sentence"	    text NOT NULL,
        "id_speaker"	    text NOT NULL,
        "location"	      text NOT NULL,
        "location_dim"	      text NOT NULL,
        "noise_level"	    integer NOT NULL,
        "noise_type"	    text NOT NULL,
        "datetime_start"	text NOT NULL,
        "datetime_end"	  text NOT NULL,
        "validated"	      text,
        "id_validator"	  text,
        FOREIGN KEY ("id_sentence") REFERENCES "sentences" ("id_sentence"),
        FOREIGN KEY ("id_speaker") REFERENCES "speakers" ("id_speaker"),
        PRIMARY KEY ("id_recording")
      )`
      )
      .run()
    process.on('exit', () => dbConn.close())
  }

  return dbConn
}
