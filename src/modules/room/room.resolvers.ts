import { GraphQLError } from 'graphql'
import { Resolvers, Room } from '../../__generated__/resolvers-types'
import { roomService } from './room.service'
import { userService } from '../auth/user/user.service'

export const roomResolvers: Resolvers = {
  Mutation: {
    async sendMessage(parent, { input }, context): Promise<Room> {
      if (!context.authorized) throw new GraphQLError('Unauthorized')

      const room = await roomService.addMessageToRoom(input.roomId, {
        from: context.currentUser.id,
        content: input.message
      })

      return room
    },

    async createRoom(parent, { input }, context): Promise<Room> {
      if (!context.authorized) throw new GraphQLError('Unauthorized')

      const roomHasUser = await roomService.findRoomWithUsersId(input.users[0], input.users[1])

      if (roomHasUser) throw new GraphQLError('Room already exists')

      const participants = await userService.findByIds([context.currentUser.id, ...input.users])

      if (participants.length !== 2) throw new GraphQLError('Participants not found')

      const room = await roomService.createRoom(participants, {
        from: context.currentUser.id,
        content: input.message
      })

      return room
    }
  }
}
