import { In, Repository } from 'typeorm'
import { User } from './entity/user.entity'
import { RegisterInput } from '~/__generated__/resolvers-types'
import bcrypt from 'bcrypt'
import { AppDataSource } from '~/app-data.source'
import { GraphQLError } from 'graphql'

class UserService {
  constructor(public userRepository: Repository<User>) {}

  async create(registerInput: RegisterInput) {
    const userExist = await this.userRepository.findOne({ where: { email: registerInput.email } })
    if (userExist) {
      throw new GraphQLError('Email already exists')
    }

    const password = await bcrypt.hash(registerInput.password, 10)
    const user = this.userRepository.create({ ...registerInput, password })

    await this.userRepository.save(user)

    return user
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()

    return user
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    })
    return user
  }

  async findByIds(ids: number[]) {
    const users = await this.userRepository.findBy({ id: In(ids) })
    return users
  }
}

export const userService = new UserService(AppDataSource.getRepository(User))
