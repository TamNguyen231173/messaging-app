import { DataSource } from 'typeorm'
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_TYPE, DB_USERNAME } from './configs'

export const AppDataSource = new DataSource({
  type: DB_TYPE,
  host: DB_HOST,
  port: 5432,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: ['./dist/**/*.entity.js'],
  logging: false,
  synchronize: true
})
