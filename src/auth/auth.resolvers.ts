import { Resolvers } from '../__generated__/resolvers-types'

const authResolvers: Resolvers = {
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
  }
}
