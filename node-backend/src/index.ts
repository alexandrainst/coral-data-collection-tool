import cors from 'cors'
import { appRouter } from './appRouter'
import { createContext } from './trpc'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { nodeHTTPFormDataContentTypeHandler } from '@trpc/server/adapters/node-http/content-type/form-data'
import { nodeHTTPJSONContentTypeHandler } from '@trpc/server/adapters/node-http/content-type/json'
import { createServer } from 'http'

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
}).listen(3333)
