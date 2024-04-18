import dotenv from 'dotenv'
import cors from 'cors'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './appRouter'

dotenv.config()
console.log('Started server')

createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    console.log('Context')
    return {}
  },
}).listen(process.env.PORT || 3000)
