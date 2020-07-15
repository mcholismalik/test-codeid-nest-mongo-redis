import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpDto } from './dto/sign-up.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { SignInDto } from './dto/sign-in.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SignUpDto })
  @Post('/signUp')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return await this.authService.signUp(signUpDto)
  }

  @ApiBody({ type: SignInDto })
  @Post('/signIn')
  @UsePipes(ValidationPipe)
  async signip(@Body() signInDto: SignInDto): Promise<{ accessToken }> {
    return await this.authService.signIn(signInDto)
  }
}
