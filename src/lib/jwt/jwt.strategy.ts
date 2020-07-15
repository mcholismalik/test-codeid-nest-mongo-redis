import * as config from 'config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from './jwt.payload'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/schemas/user.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel('User') private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret')
    })
  }

  async validate(jwtPayload: JwtPayload): Promise<User> {
    const { userName } = jwtPayload
    const user = await this.userModel.findOne({ userName })
    if (!user) throw new UnauthorizedException()
    return user
  }
}
