import { Repository } from 'typeorm'
import { User } from './entity/user.entity'
import { RegisterInput } from '~/__generated__/resolvers-types'
import bcrypt from 'bcrypt'
import { AppDataSource } from '~/app-data.source'

class UserService {
  constructor(public userRepository: Repository<User>) {}

  async create(registerInput: RegisterInput) {
    const userExist = await this.userRepository.findOne({ where: { email: registerInput.email } })
    if (userExist) {
      throw new Error('Email already exists')
    }

    const password = await bcrypt.hash(registerInput.password, 10)
    const user = this.userRepository.create({ ...registerInput, password })

    return await this.userRepository.save(user)
  }
}

export const userService = new UserService(AppDataSource.getRepository(User))
