import { ApolloServer } from 'apollo-server-express'
import { readFileSync } from 'fs'
import http from 'http'
import { Resolvers } from './__generated__/resolvers-types'
import express from 'express'
import { authResolvers } from './auth/auth.resolvers'

export class AppModule {
  constructor(public resolvers: Resolvers) {}

  async startApollo(): Promise<{ httpServer: http.Server; server: ApolloServer }> {
    const typeDefs = readFileSync('schema.graphql', 'utf-8')

    const app = express() as any

    const httpServer = http.createServer(app)

    const server = new ApolloServer({
      typeDefs,
      resolvers: this.resolvers
    })

    await server.start()

    server.applyMiddleware({ app })

    return { httpServer, server }
  }
}

export const AppModuleInstance = new AppModule(authResolvers)
