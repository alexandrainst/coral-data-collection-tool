import { publicProcedure, router } from './trpc'
import { RecordingTestSchema, UserDataSchema } from '../types'
import { z } from 'zod'

export const appRouter = router({
  infiniteTexts: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        direction: z.enum(['forward', 'backward']), // optional, useful for bi-directional query
      })
    )
    .query(async opts => {
      console.log('Recieved text query')
      const { cursor } = opts.input

      const text = {
        text: Math.random().toString(36).substring(0, 11),
        id: Math.random(),
      }

      return {
        text,
        cursor,
      }
    }),
  textToRecord: publicProcedure.query(() => {
    return {
      text: Math.random().toString(36).substring(0, 11),
      id: Math.random(),
    }
  }),
  recording: publicProcedure.input(RecordingTestSchema).mutation(opts => {
    console.log('Recieved recording query')
    return opts.input.id
  }),
  user: publicProcedure.input(UserDataSchema).mutation(opts => {
    console.log('Recieved user query')
    return opts.input.email
  }),
})

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter
