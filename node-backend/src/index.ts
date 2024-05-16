import { createHTTPServer } from '@trpc/server/adapters/standalone'
import cors from 'cors'
import { appRouter } from './appRouter'
import { createContext } from './context'
import dotenv from 'dotenv'
dotenv.config()
console.log(`Listening on port ${process.env.CORAL_PORT}`)
createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext: createContext,
}).listen(process.env.CORAL_PORT)
