import { Resolvers } from '../__generated__/resolvers-types'

export const authResolvers: Resolvers = {
  Mutation: {
    async register(parent, { input }, context) {
      return {
        jwt: 'jwt',
        user: {
          id: 1,
          ...input
        }
      }
    }
  },

  Query: {
    users: async (parent, args, context) => {
      return [
        {
          id: 1,
          email: 'user1@example.com',
          password: 'password1',
          firstName: 'User',
          lastName: 'One'
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: 'password2',
          firstName: 'User',
          lastName: 'Two'
        }
      ]
    },

    user: async (parent, { id }, context) => {
      return {
        id: id,
        email: 'user@example.com',
        password: 'password',
        firstName: 'User',
        lastName: 'Last'
      }
    }
  }
}
