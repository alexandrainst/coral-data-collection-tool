import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { Recording } from '../types'

// https://github.com/trpc/trpc/blob/main/examples/.experimental/next-formdata/src/utils/writeFileToDisk.ts
export const writeRecordingToDisk = async (recording: Recording) => {
  const rootDir = __dirname + '/..'

  const date = new Date()
  const fileDir = path.resolve(`${rootDir}/uploads/${date.toDateString()}`)

  const recordingId = recording.textId

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true })
  }

  const fd = fs.createWriteStream(
    path.resolve(`${fileDir}/${recordingId}.${recording.format}`)
  )

  const fileStream = Readable.fromWeb(
    // @ts-expect-error - unsure why this is not working
    recording.file.stream()
  )
  for await (const chunk of fileStream) {
    fd.write(chunk)
  }
  fd.end()

  return recordingId
}
