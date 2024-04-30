import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../auth/user/entity/user.entity'
import { Message } from '~/__generated__/resolvers-types'

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToMany(() => User)
  @JoinTable()
  @Column('jsonb', { nullable: false })
  users: User[]

  @Column('jsonb', { nullable: false })
  message: Message[]
}
