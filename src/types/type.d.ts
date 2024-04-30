import { Request } from 'express'
import { Socket } from 'socket.io'

declare module 'express-serve-static-core' {
  interface Request {
    socketIo?: Socket
  }
}
