import { IsString, MaxLength, IsNotEmpty, IsEmail, IsNumber, MinLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpDto {
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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password must contain at least one uppercase, lowercase, number digit, and special character'
  })
  password: string
}
