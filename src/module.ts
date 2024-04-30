import { mergeResolvers } from '@graphql-tools/merge'
import { ApolloServer, ExpressContext } from 'apollo-server-express'
import express from 'express'
import { readFileSync } from 'fs'
import http from 'http'
import jwt from 'jsonwebtoken'
import { JwtPayload, Resolvers } from './__generated__/resolvers-types'
import { AppDataSource } from './app-data.source'
import { JWT_SECRET, PORT } from './configs'
import { authResolvers } from './modules/auth/auth.resolvers'
import { Room } from './modules/room/entity/room.entity'
import { roomResolvers } from './modules/room/room.resolvers'
import { Server } from 'socket.io'

export interface MyContext extends ExpressContext {
  currentUser: JwtPayload
  authorized: boolean
  io: Server
}

export class AppModule {
  constructor(public resolvers: Resolvers) {}

  async startApollo(): Promise<{ httpServer: http.Server; server: ApolloServer<MyContext> }> {
    const typeDefs = readFileSync('schema.graphql', 'utf-8')

    const appDataSource = await AppDataSource.initialize()

    const app = express() as any

    const httpServer = http.createServer(app)

    const io = new Server(httpServer, {
      cors: {
        origin: `http://127.0.0.1:${PORT}`
      }
    })

    io.on('connection', (socket) => {
      app.request.socketIo = socket
    })

    const server = new ApolloServer({
      typeDefs,
      resolvers: this.resolvers,
      context: async ({ req, res }) => {
        if (!req.headers.authorization) {
          return {
            currentUser: null,
            io,
            req,
            authorized: false
          }
        }

        const payload = jwt.verify(req.headers.authorization, JWT_SECRET) as JwtPayload

        if (typeof payload !== 'string' && payload) {
          const rooms = await appDataSource.manager
            .getRepository(Room)
            .createQueryBuilder('room')
            .innerJoin('room.users', 'user')
            .where('user.id = :id', { id: payload.id })
            .getMany()

          const roomIds = rooms.map((room) => room.id.toString())

          await req.socketIo?.join(roomIds)
        }

        return {
          currentUser: payload,
          io,
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
