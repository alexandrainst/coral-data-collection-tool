import { publicProcedure, router } from './trpc'
import { RecordingFormDataSchema, UserDataSchema } from '../types'

import {
  experimental_createMemoryUploadHandler,
  experimental_parseMultipartFormData,
} from '@trpc/server/adapters/node-http/content-type/form-data'
import { writeRecordingToDisk } from './util'

export const appRouter = router({
  textToRecord: publicProcedure.query(opts => {
    console.log('Recieved single text query')
    opts.ctx.transcription.text = Math.random().toString(36).substring(0, 11)
    opts.ctx.transcription.id = Math.random() + ''
    opts.ctx.unvalidatedTexts.add(opts.ctx.transcription.id)
    return opts.ctx.transcription
  }),
  recording: publicProcedure
    .use(async opts => {
      const formData = await experimental_parseMultipartFormData(
        opts.ctx.req,
        experimental_createMemoryUploadHandler()
      )

      return opts.next({
        getRawInput: async () => formData,
      })
    })
    .input(RecordingFormDataSchema)
    .mutation(async opts => {
      console.log(`Recieved recording with user id: ${opts.input.userId}`)
      opts.ctx.unvalidatedTexts.delete(opts.input.textId)
      return await writeRecordingToDisk(opts.input)
    }),
  user: publicProcedure.input(UserDataSchema).mutation(opts => {
    console.log('Recieved user query')
    opts.ctx.user = opts.input
    return opts.ctx.user.email
  }),
})

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter
