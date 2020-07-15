import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { SignUpDto } from './dto/sign-up.dto'
import { SignInDto } from './dto/sign-in.dto'
import * as bcrypt from 'bcryptjs'
import { JwtPayload } from 'src/lib/jwt/jwt.payload'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { UserConfig, User } from 'src/schemas/user.schema'
import { Model } from 'mongoose'

@Injectable()
export class AuthService {
  constructor(@InjectModel(UserConfig.name) private userModel: Model<User>, private jwtService: JwtService) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    try {
      const user = new this.userModel(signUpDto)
      user.salt = await bcrypt.genSalt()
      user.password = await bcrypt.hash(signUpDto.password, user.salt)
      await user.save()
    } catch (err) {
      if (err.code === 11000) throw new ConflictException('userName or email already exists')
      throw new InternalServerErrorException()
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken }> {
    const user = await this.validateUserPassword(signInDto)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const jwtPayload: JwtPayload = { userName: user.userName }
    const accessToken = await this.jwtService.sign(jwtPayload)
    return { accessToken }
  }

  async validateUserPassword(signInDto: SignInDto): Promise<User | null> {
    const { userName, password } = signInDto
    const user = await this.userModel.findOne({ userName }).select('+password')
    return user && (await this.validatePassword(password, user.password, user.salt)) ? user : null
  }

  async validatePassword(password, userPassword, salt): Promise<boolean> {
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword === userPassword
  }
}
