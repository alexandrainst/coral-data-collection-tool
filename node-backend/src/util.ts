import { createHash } from 'node:crypto'
import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'

export const ensureDataDir = (): string => {
  const dataDir =
    process.env.NODE_ENV === 'production'
      ? process.env.CORAL_DATA_DIR ?? '/'
      : `${__dirname}/..`
  log(dataDir)
  if (!dataDir) {
    throw new Error('CORAL_DATA_DIR is not defined')
  }

  if (!isAbsolute(dataDir)) {
    throw new Error('CORAL_DATA_DIR is not absolute')
  }

  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }

  return dataDir
}

export const saveRecodingFile = (name: string, ext: string, file: File) => {
  const start = performance.now()

  const recordingsDir = join(ensureDataDir(), 'recordings')
  if (!existsSync(recordingsDir)) {
    mkdirSync(recordingsDir, { recursive: true })
  }

  const recordingPath = join(recordingsDir, `${name}.${ext}`)
  file
    .arrayBuffer()
    .then(buffer => writeFile(recordingPath, Buffer.from(buffer)))
    .then(() => {
      const end = performance.now()
      log(
        `[${(end - start).toFixed(2)}ms] Finished writing file: ${name}.${ext}`
      )
    })
}

export const log = (message?: unknown, ...optionalParams: unknown[]): void => {
  console.log(`[${new Date().toISOString()}]`, message, ...optionalParams)
}

export const getSpeakerId = (email: string): string => {
  return `spe_${hash(email)}`
}

export const getRecordingId = (
  speakerId: string,
  sentenceId: string,
  datetimeEnd: string
): string => {
  return `rec_${hash(speakerId + sentenceId + datetimeEnd)}`
}

const hash = (str: string): string => {
  const hash = createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

export const convertISO8601ToCustomFormat = (isoDateString: string) =>
  isoDateString.replace(/T/, ' ').replace(/\..+/, '')
