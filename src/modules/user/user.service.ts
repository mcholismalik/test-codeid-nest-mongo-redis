import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from 'src/models/user.model'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async getUsers(): Promise<User[]> {
    return await this.userModel.find()
  }

  async getUserById(id: string): Promise<User> {
    return await this.userModel.findById(id)
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
