import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import { Database } from 'better-sqlite3'
import { IncomingMessage, ServerResponse } from 'node:http'
import { getDB } from './db'

export type Context = {
  db: Database
  req: IncomingMessage
  res: ServerResponse
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(
  opts: CreateHTTPContextOptions
): Promise<Context> {
  const db = getDB()

  return {
    db,
    req: opts.req,
    res: opts.res,
  }
}
