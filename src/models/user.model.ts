import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  accountNumber: { type: Number, required: true },
  emailAddress: { type: String, required: true, unique: true },
  identityNumber: { type: Number, required: true },
  salt: { type: String, required: false },
  password: { type: String, required: false }
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
