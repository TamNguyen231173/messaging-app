import * as dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 4000
export const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret'
export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '1d'
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'

export const DB_TYPE = 'postgres'
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = process.env.DB_PORT || 5432
export const DB_USERNAME = process.env.DB_USERNAME || 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD || ''
export const DB_DATABASE = process.env.DB_DATABASE || 'main'
