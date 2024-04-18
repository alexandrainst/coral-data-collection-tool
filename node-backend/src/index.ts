import dotenv from 'dotenv'
import cors from 'cors'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './appRouter'

dotenv.config()
console.log('Started server')

createHTTPServer({
  middleware: cors(),
  router: appRouter,
}).listen(process.env.PORT || 3000)
