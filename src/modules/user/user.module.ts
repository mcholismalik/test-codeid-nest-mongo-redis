import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema, UserConfig } from 'src/schemas/user.schema'
import { RedisModule } from 'src/lib/redis/redis.module'
import { RedisService } from 'src/lib/redis/redis.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: UserConfig.name, schema: UserSchema }]), RedisModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
