import int32ToUint32 from '@stdlib/number-int32-base-to-uint32'
import adler32 from 'adler-32'
import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'

export const ensureDataDir = (): string => {
  const dataDir = process.env.CORAL_DATA_DIR
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

export const getId = (str: string): string => {
  return int32ToUint32(adler32.str(str)).toString()
}
