import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
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

  async getUserCache(cacheKey: string): Promise<User | null> {
    const isCacheExist = await this.redisService.get(cacheKey)
    if (isCacheExist) {
      console.log('get from cache', { cacheKey, cacheValue: isCacheExist })
      return JSON.parse(isCacheExist)
    }
    return null
  }

  async getUserByAccountNumber(accountNumber: number): Promise<User> {
    const cacheKey = UserConfig.cacheKey + 'accountNumber_' + accountNumber
    const cache = await this.getUserCache(cacheKey)
    if (cache) return cache

    const user = await this.userModel.findOne({ accountNumber })
    if (!user) throw new NotFoundException(`There's no user for this accountNumber (${accountNumber})`)

    const cacheValue = JSON.stringify(user)
    await this.redisService.set(cacheKey, cacheValue)

    console.log('get by accountNumber from db', { user })
    return user
  }

  async getUserByIdentityNumber(identityNumber: number): Promise<User> {
    const cacheKey = UserConfig.cacheKey + 'identityNumber_' + identityNumber
    const cache = await this.getUserCache(cacheKey)
    if (cache) return cache

    const user = await this.userModel.findOne({ identityNumber })
    if (!user) throw new NotFoundException(`There's no user for this identityNumber (${identityNumber})`)

    const cacheValue = JSON.stringify(user)
    await this.redisService.set(cacheKey, cacheValue)

    console.log('get by identityNumber from db', { user })
    return user
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto)
      user.salt = await bcrypt.genSalt()
      user.password = await bcrypt.hash(createUserDto.password, user.salt)
      await (await user.save()).toObject()

      delete user.salt
      delete user.password
      return user
    } catch (err) {
      if (err.code === 11000) throw new ConflictException('userName | email | identityNumber | accountNumber already exists')
      throw new InternalServerErrorException()
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { userName, accountNumber, emailAddress, identityNumber, password } = updateUserDto
      const user = await this.userModel.findById(id)
      const userClone = { ...user.toObject() }
      if (userName) user.userName = userName
      if (accountNumber) user.accountNumber = accountNumber
      if (emailAddress) user.emailAddress = emailAddress
      if (identityNumber) user.identityNumber = identityNumber
      if (password) {
        user.salt = await bcrypt.genSalt()
        user.password = await bcrypt.hash(updateUserDto.password, user.salt)
      }
      await (await user.save()).toObject()

      // cache
      const cacheKeyAccountNumber = UserConfig.cacheKey + 'accountNumber_' + user.accountNumber
      await this.setDelUserCache(cacheKeyAccountNumber, userClone.accountNumber, user.accountNumber, user)
      const cacheKeyIdentityNumber = UserConfig.cacheKey + 'identityNumber_' + user.identityNumber
      await this.setDelUserCache(cacheKeyIdentityNumber, userClone.identityNumber, user.identityNumber, user)

      delete user.salt
      delete user.password
      return user
    } catch (err) {
      if (err.code === 11000) throw new ConflictException('userName | email | identityNumber | accountNumber already exists')
      throw new InternalServerErrorException()
    }
  }

  async setDelUserCache(cacheKey: string, oldKey: any, newKey: any, user: User): Promise<void> {
    return oldKey !== newKey
      ? await this.redisService.del(cacheKey).then(() => console.log('del cache', { cacheKey }))
      : await this.redisService
          .set(cacheKey, JSON.stringify(user))
          .then(() => console.log('set cache', { cacheKey, cacheValue: JSON.stringify(user) }))
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findById(id)

    // cache
    const cacheKeyAccountNumber = UserConfig.cacheKey + 'accountNumber_' + user.accountNumber
    const cacheKeyIdentityNumber = UserConfig.cacheKey + 'identityNumber_' + user.identityNumber
    await this.redisService.del(cacheKeyAccountNumber).then(() => console.log('del cache', { cacheKey: cacheKeyAccountNumber }))
    await this.redisService.del(cacheKeyIdentityNumber).then(() => console.log('del cache', { cacheKey: cacheKeyIdentityNumber }))

    const result = await this.userModel.deleteOne({ _id: id })
    if (result.n === 0) throw new NotFoundException(`There's no user for this id ${id}`)
  }
}
