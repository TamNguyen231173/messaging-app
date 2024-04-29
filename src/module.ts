import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { readFileSync } from 'fs'
import http from 'http'
import { JwtPayload, Resolvers } from './__generated__/resolvers-types'
import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './configs'
import { authResolvers } from './modules/auth/auth.resolvers'
import { roomResolvers } from './modules/room/room.resolvers'
import { mergeResolvers } from '@graphql-tools/merge'

export interface MyContext extends ExpressContext {
  currentUser: JwtPayload
  authorized: boolean
}

export class AppModule {
  constructor(public resolvers: Resolvers) {}

  async startApollo(): Promise<{ httpServer: http.Server; server: ApolloServer<MyContext> }> {
    const typeDefs = readFileSync('schema.graphql', 'utf-8')

    const app = express() as any

    const httpServer = http.createServer(app)

    const server = new ApolloServer({
      typeDefs,
      resolvers: this.resolvers,
      context: ({ req, res }) => {
        if (!req.headers.authorization) {
          return {
            currentUser: null,
            req,
            authorized: false
          }
        }

        const payload = jwt.verify(req.headers.authorization, JWT_SECRET) as JwtPayload

        return {
          currentUser: payload,
          req,
          authorized: !!payload
        }
      }
    })

    await server.start()

    server.applyMiddleware({ app })

    return { httpServer, server }
  }
}

export const AppModuleInstance = new AppModule(mergeResolvers([authResolvers, roomResolvers]) as Resolvers)
