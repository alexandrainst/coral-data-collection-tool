import { TRPCError } from '@trpc/server'
import { SqliteError } from 'better-sqlite3'
import { performance } from 'node:perf_hooks'
import { z } from 'zod'
import {
  RecordingFormDataSchema,
  Sentence,
  SentenceSchema,
  Speaker,
  SpeakerSchema,
} from '../types'
import { publicProcedure, router } from './trpc'
import {
  convertISO8601ToCustomFormat,
  getId,
  log,
  saveRecodingFile,
} from './util'

export const appRouter = router({
  user: publicProcedure
    .input(SpeakerSchema)
    .output(z.string())
    .mutation(opts => {
      const start = performance.now()

      const speaker = {
        ...opts.input,
        zip_school: opts.input.zipcode_school.toString(),
        zip_birth: opts.input.zipcode_birth.toString(),
        language_native: opts.input.language_native.toString(),
        language_spoken: opts.input.language_spoken.toString(),
        id_speaker: `spe_${getId(opts.input.email)}`,
      }
      try {
        // TODO: Update user if already exists?
        opts.ctx.db
          .prepare(
            `INSERT INTO speakers VALUES
           (@id_speaker, @name, @email, @age, @gender, @dialect, @language_native, @language_spoken, @zip_school, @zip_birth, @country_birth, @education, @occupation, NULL)`
          )
          .run(speaker)
      } catch (e: unknown) {
        log(
          'Failed to create speaker:',
          e instanceof SqliteError
            ? {
                speaker: speaker,
                error: {
                  name: e.name,
                  code: e.code,
                  message: e.message,
                },
              }
            : e
        )
      }

      const end = performance.now()
      log(`[${(end - start).toFixed(2)}ms] Stored speaker:`, speaker)
      return speaker.id_speaker
    }),

  textToRecord: publicProcedure
    .input(z.undefined())
    .output(SentenceSchema)
    .query(opts => {
      const start = performance.now()

      const sentence = opts.ctx.db
        .prepare(
          'SELECT * FROM sentences WHERE flag_sample = 1 ORDER BY random() LIMIT 1'
        )
        .get() as Sentence

      const end = performance.now()
      log(`[${(end - start).toFixed(2)}ms] Loaded sentence:`, sentence)
      return sentence
    }),

  recording: publicProcedure
    .input(RecordingFormDataSchema)
    .output(z.string())
    .mutation(opts => {
      const start = performance.now()
      log('Got recording for:', {
        id_speaker: opts.input.id_speaker,
        id_sentence: opts.input.id_sentence,
      })

      const speaker = opts.ctx.db
        .prepare('SELECT * FROM speakers WHERE id_speaker = ?')
        .get(opts.input.id_speaker) as Speaker
      if (!speaker) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const recording = {
        ...opts.input,
        datetime_start: convertISO8601ToCustomFormat(opts.input.datetime_start),
        datetime_end: convertISO8601ToCustomFormat(opts.input.datetime_end),
        id_recording: `rec_${getId(speaker.email + opts.input.datetime_end)}`,
      }

      try {
        opts.ctx.db
          .prepare(
            `INSERT INTO recordings VALUES
           (@id_recording, @id_sentence, @id_speaker, @location, @location_dim, @noise_level, @noise_type, @datetime_start, @datetime_end, NULL, NULL)`
          )
          .run(recording)
      } catch (e: unknown) {
        log(
          'Failed to create recording:',
          e instanceof SqliteError
            ? {
                recording: recording,
                error: {
                  name: e.name,
                  code: e.code,
                  message: e.message,
                },
              }
            : e
        )

        throw e
      }
      saveRecodingFile(recording.id_recording, opts.input.ext, opts.input.file)

      const end = performance.now()
      log(`[${(end - start).toFixed(2)}ms] Saved recording:`, recording)
      return recording.id_recording
    }),
})

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter
