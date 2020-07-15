import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema, UserConfig } from 'src/schemas/user.schema'
import { RedisModule } from 'src/lib/redis/redis.module'
import { RedisService } from 'src/lib/redis/redis.service'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: UserConfig.name,
        imports: [RedisModule],
        useFactory: (redisService: RedisService) => {
          const schema = UserSchema
          schema.post('save', async doc => {
            const cacheKey = UserConfig.cacheKey + doc._id
            const cacheValue = JSON.stringify(doc)
            const isCacheExist = await redisService.get(cacheKey)
            if (isCacheExist) {
              console.log('set cache', { cacheKey, cacheValue })
              await redisService.set(cacheKey, cacheValue)
            }
          })
          return schema
        },
        inject: [RedisService]
      }
    ]),
    RedisModule
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
