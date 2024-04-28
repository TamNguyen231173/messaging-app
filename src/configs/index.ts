import * as dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 4000
export const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret'
export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '1d'
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'