import { ACCESS_TOKEN_EXPIRES_IN, JWT_SECRET, REFRESH_TOKEN_EXPIRES_IN } from '~/configs'
import { AuthResponse, JwtPayload, Resolvers, User } from '../__generated__/resolvers-types'
import { userService } from './user/user.service'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

function generateAccessToken(email: string, userId: number) {
  return jwt.sign({ email, userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN
  })
}

function generateRefreshToken(email: string, userId: number) {
  return jwt.sign({ email, userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  })
}

export const authResolvers: Resolvers = {
  Mutation: {
    async register(parent, { input }, context): Promise<AuthResponse> {
      const existUser = await userService.findOneByEmail(input.email)

      if (existUser) {
        throw new Error('Email already exists')
      }

      const user = await userService.create(input)

      return {
        user,
        accessToken: generateAccessToken(input.email, user.id),
        refreshToken: generateRefreshToken(input.email, user.id)
      }
    },

    async login(parent, { input: { email, password } }, context): Promise<AuthResponse> {
      const user = await userService.findOneByEmail(email)

      if (!user) {
        throw new Error('Email or password is incorrect')
      }

      const valid = await bcrypt.compare(password, user.password)

      if (!valid) {
        throw new Error('Email or password is incorrect')
      }

      return {
        user,
        accessToken: generateAccessToken(email, user.id),
        refreshToken: generateRefreshToken(email, user.id)
      }
    }
  },

  Query: {
    currentUser(parent, input, context): JwtPayload {
      if (!context.authorized) {
        throw new Error('Unauthorized')
      }

      return context.currentUser
    }
  }
}
