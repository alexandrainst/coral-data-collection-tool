import dotenv from 'dotenv'
import cors from 'cors'
import { appRouter } from './appRouter'
import { createContext } from './trpc'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { nodeHTTPFormDataContentTypeHandler } from '@trpc/server/adapters/node-http/content-type/form-data'
import { nodeHTTPJSONContentTypeHandler } from '@trpc/server/adapters/node-http/content-type/json'
import { createServer } from 'http'

dotenv.config()

const handler = createHTTPHandler({
  middleware: cors(),
  router: appRouter,
  createContext: createContext,
  experimental_contentTypeHandlers: [
    nodeHTTPFormDataContentTypeHandler(),
    nodeHTTPJSONContentTypeHandler(),
  ],
})

createServer((req, res) => {
  handler(req, res)
}).listen(process.env.PORT)
