import { Controller, Post, UsePipes, ValidationPipe, Body, Get, Param, Put, Delete, ParseIntPipe, UseGuards } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'
import { User } from 'src/schemas/user.schema'
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from '@nestjs/passport'
import { ResponsePayload } from 'src/lib/response/response.payload'

@ApiTags('user')
@ApiBearerAuth('access-token')
@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<ResponsePayload> {
    const data = await this.userService.getUsers()
    return new ResponsePayload(`Get users success`, data)
  }

  @Get('/accountNumber/:accountNumber')
  async getUserByAccountNumber(@Param('accountNumber') accountNumber: number): Promise<ResponsePayload> {
    const data = await this.userService.getUserByAccountNumber(accountNumber)
    return new ResponsePayload(`Get user by accountNumber (${accountNumber}) success`, data)
  }

  @Get('/identityNumber/:identityNumber')
  async getUserByIdentityNumber(@Param('identityNumber') identityNumber: number): Promise<ResponsePayload> {
    const data = await this.userService.getUserByIdentityNumber(identityNumber)
    return new ResponsePayload(`Get user by identityNumber (${identityNumber}) success`, data)
  }

  @ApiBody({ type: CreateUserDto })
  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ResponsePayload> {
    const data = await this.userService.createUser(createUserDto)
    return new ResponsePayload(`Create user success`, data)
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponsePayload> {
    const data = await this.userService.updateUser(id, updateUserDto)
    return new ResponsePayload(`Update user by id (${id}) success`, data)
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<ResponsePayload> {
    await this.userService.deleteUser(id)
    return new ResponsePayload(`Delete user by id (${id}) success`)
  }
}
