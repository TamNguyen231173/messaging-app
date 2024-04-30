import { IsEmail, MinLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { Room } from '~/modules/room/entity/room.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  @IsEmail()
  email: string

  @Column({ select: false })
  @MinLength(6)
  password!: string

  @ManyToMany(() => Room)
  @Column()
  rooms: Room[]
}
