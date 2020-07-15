import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { RedisService } from 'src/lib/redis/redis.service'
import { User, UserConfig } from 'src/schemas/user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>, private redisService: RedisService) {}

  async getUsers(): Promise<User[]> {
    return await this.userModel.find()
  }

  async getUserById(id: string): Promise<User> {
    const cacheKey = UserConfig.cacheKey + id
    const isCacheExist = await this.redisService.get(cacheKey)
    if (isCacheExist) {
      console.log('get from cache')
      return JSON.parse(isCacheExist)
    }

    const user = await this.userModel.findById(id)
    const cacheValue = JSON.stringify(user)
    await this.redisService.set(cacheKey, cacheValue)
    console.log('get from db')
    return user
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto)
      const result = await user.save()
      return result
    } catch (err) {
      if (err.code === 11000) throw new ConflictException('userName or email already exists')
      throw new InternalServerErrorException()
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { userName, accountNumber, emailAddress, identityNumber } = updateUserDto
    const user = await this.userModel.findById(id)
    if (userName) user.userName = userName
    if (accountNumber) user.accountNumber = accountNumber
    if (emailAddress) user.emailAddress = emailAddress
    if (identityNumber) user.identityNumber = identityNumber
    await user.save()
    return user
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id })
    if (result.n === 0) throw new NotFoundException(`There's no user for this id ${id}`)
  }
}
