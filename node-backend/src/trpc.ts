import { initTRPC } from '@trpc/server'
import type * as trpcNext from '@trpc/server/adapters/next'
import { ZodError } from 'zod'
import { Transcription, UserData } from '../types'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const user: UserData = {
    email: '',
    name: '',
    age: 0,
    sex: '',
    dialect: '',
    nativeLanguage: '',
    spokenLanguages: [],
    postalCodeSchool: 0,
    postalCodeAddress: 0,
    levelOfEducation: '',
    placeOfBirth: '',
    occupation: '',
  }

  const transcription: Transcription = {
    text: Math.random().toString(36).substring(0, 11),
    id: Math.random() + '',
  }
  const unvalidatedTexts: Set<string> = new Set()
  return {
    req: opts.req,
    user,
    transcription,
    unvalidatedTexts,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    return {
      ...opts.shape,
      data: {
        zodError:
          opts.error.code === 'BAD_REQUEST' &&
          opts.error.cause instanceof ZodError
            ? opts.error.cause.flatten()
            : null,
        ...opts.shape.data,
      },
    }
  },
})

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure
