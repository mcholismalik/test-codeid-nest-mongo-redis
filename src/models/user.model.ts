import * as mongoose from 'mongoose'
import { RedisService } from 'src/lib/redis/redis.service'

export const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  accountNumber: { type: Number, required: true },
  emailAddress: { type: String, required: true, unique: true },
  identityNumber: { type: Number, required: true },
  salt: { type: String, required: false },
  password: { type: String, required: false }
})

UserSchema.post('save', async function(doc) {
  const redisService = new RedisService()
  await redisService.set(9, 'coba lagi')
  console.log('%s has been saved', doc._id)
})

export interface User extends mongoose.Document {
  id: string
  userName: string
  accountNumber: number
  emailAddress: string
  identityNumber: number
  salt: string
  password: string
}
