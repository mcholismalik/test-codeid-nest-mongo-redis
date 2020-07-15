import * as config from 'config'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from 'src/lib/jwt/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { UserSchema, UserConfig } from 'src/schemas/user.schema'
import { MongooseModule } from '@nestjs/mongoose'

const jwtConfig = config.get('jwt')

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: UserConfig.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn
      }
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
