import { Controller, Post, UsePipes, ValidationPipe, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'
import { User } from 'src/schemas/user.schema'
import { ApiTags } from '@nestjs/swagger'
import { UpdateUserDto } from './dto/update-user.dto'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers()
  }

  @Get('/accountNumber/:accountNumber')
  async getUserByAccountNumber(@Param('accountNumber') accountNumber: number): Promise<User> {
    return await this.userService.getUserByAccountNumber(accountNumber)
  }

  @Get('/identityNumber/:identityNumber')
  async getUserByIdentityNumber(@Param('identityNumber') identityNumber: number): Promise<User> {
    return await this.userService.getUserByIdentityNumber(identityNumber)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto)
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(id, updateUserDto)
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userService.deleteUser(id)
  }
}
