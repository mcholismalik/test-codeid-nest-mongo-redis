import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpDto } from './dto/sign-up.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { SignInDto } from './dto/sign-in.dto'
import { ResponsePayload } from 'src/lib/response/response.payload'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SignUpDto })
  @Post('/signUp')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpDto): Promise<ResponsePayload> {
    await this.authService.signUp(signUpDto)
    return new ResponsePayload(`Sign up success`)
  }

  @ApiBody({ type: SignInDto })
  @Post('/signIn')
  @UsePipes(ValidationPipe)
  async signip(@Body() signInDto: SignInDto): Promise<ResponsePayload> {
    const data = await this.authService.signIn(signInDto)
    return new ResponsePayload(`Sign in success`, data)
  }
}
