import { IsString, MaxLength, IsEmail, IsNumber, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  userName: string

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  accountNumber: number

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  emailAddress: string

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  identityNumber: number
}
