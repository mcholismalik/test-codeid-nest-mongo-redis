import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true, unique: true })
  userName: string

  @Prop({ type: String })
  accountNumber: number

  @Prop({ type: String, required: true, unique: true })
  emailAddress: string

  @Prop({ type: String })
  identityNumber: number

  @Prop({ type: String })
  salt: string

  @Prop({ type: String })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)

export const UserConfig = {
  name: 'User',
  cacheKey: 'USER_'
}