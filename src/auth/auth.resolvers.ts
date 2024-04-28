import { ACCESS_TOKEN_EXPIRES_IN, JWT_SECRET, REFRESH_TOKEN_EXPIRES_IN } from '~/configs'
import { AuthResponse, Resolvers, User } from '../__generated__/resolvers-types'
import { userService } from './user/user.service'
import jwt from 'jsonwebtoken'

export const authResolvers: Resolvers = {
  Mutation: {
    async register(parent, { input }, context): Promise<AuthResponse> {
      const existUser = await userService.findOneByEmail(input.email)

      if (existUser) {
        throw new Error('Email already exists')
      }
      const user = await userService.create(input)

      const accessToken = jwt.sign({ email: input.email, userId: user.id }, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
      })
      const refreshToken = jwt.sign({ email: input.email, userId: user.id }, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
      })

      return {
        user,
        accessToken,
        refreshToken
      }
    }
  },

  Query: {
    users: async (parent, args, context) => {
      return [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          password: 'password1'
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@example.com',
          password: 'password2'
        }
      ]
    },

    user: async (parent, { id }, context) => {
      return {
        id: id,
        username: 'user',
        email: 'user@example.com',
        password: 'password'
      }
    }
  }
}
