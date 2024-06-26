import { Repository } from 'typeorm'
import { Room } from './entity/room.entity'
import { AppDataSource } from '~/app-data.source'
import { User } from '../auth/user/entity/user.entity'
import { Message } from '~/__generated__/resolvers-types'
import { Server } from 'socket.io'

class RoomService {
  constructor(private readonly roomRepository: Repository<Room>) {}

  async addMessageToRoom(roomId: number, message: Message, io?: Server): Promise<Room> {
    const queryBuilder = this.roomRepository.createQueryBuilder('room')
    await queryBuilder
      .update(Room, { messages: () => `messages || '${JSON.stringify(message)}'::jsonb` })
      .where('id = :id', { id: roomId })
      .execute()

    if (io) {
      io.to(`${roomId}`).emit('message', {
        message,
        roomId
      })
    }

    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users']
    })

    if (!room) {
      throw new Error('Room not found')
    }

    return room
  }

  async createRoom(users: User[], messages: Message): Promise<Room> {
    const room = this.roomRepository.create({
      users,
      messages: [messages]
    })
    await this.roomRepository.save(room)
    return room
  }

  async findRoomWithUsersId(receiverId: number, senderId: number) {
    const queryBuilder = this.roomRepository.createQueryBuilder('room')

    const rooms = await queryBuilder
      .select()
      .innerJoin('room.users', 'users')
      .where('users.id = :senderId', { senderId })
      .getMany()

    return !!rooms?.some((room) => room.users.some((user) => user.id === receiverId))
  }

  async getAllRooms(userId: number) {
    const queryBuilder = this.roomRepository.createQueryBuilder('room')

    const rooms = await queryBuilder
      .select()
      .innerJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .getMany()

    return rooms
  }
}

export const roomService = new RoomService(AppDataSource.getRepository(Room))
