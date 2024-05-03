import { initTRPC } from '@trpc/server'
import {
  experimental_createMemoryUploadHandler,
  experimental_parseMultipartFormData,
} from '@trpc/server/adapters/node-http/content-type/form-data'
import { ZodError } from 'zod'
import { Context } from './context'

const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
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
export const formProcedure = publicProcedure.use(opts =>
  opts.next({
    getRawInput: () =>
      experimental_parseMultipartFormData(
        opts.ctx.req,
        experimental_createMemoryUploadHandler()
      ),
  })
)
