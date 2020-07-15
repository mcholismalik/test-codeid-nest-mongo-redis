import { IsString, MaxLength, IsNotEmpty, IsEmail, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  userName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  accountNumber: number

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  emailAddress: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  identityNumber: number
}
