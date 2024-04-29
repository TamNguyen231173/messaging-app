import { GraphQLError } from 'graphql'
import { Resolvers, Room } from '../../__generated__/resolvers-types'

export const roomResolvers: Resolvers = {
  Mutation: {
    async sendMessage(parent, { input }, context): Promise<Room> {
      if (!context.authorized) throw new GraphQLError('Unauthorized')

      return {
        id: 1,
        users: [],
        messages: [
          {
            from: context.currentUser.id,
            content: input.message
          }
        ]
      }
    }
  }
}
