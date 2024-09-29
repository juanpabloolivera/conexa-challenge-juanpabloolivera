import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from '../../core/dto/login.dto';
import { SignUpDTO } from '../../core/dto/signup.dto';

@ApiTags('Auth Endpoints')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDTO: SignUpDTO): Promise<{ token: string }> {
    const isDuplicated = await this.authService.validateDuplicateEmail(
      signUpDTO,
    );
    if (isDuplicated) {
      throw new BadRequestException(
        "There's already an user with that email. Elegí otro",
      );
    }
    return this.authService.signUp(signUpDTO);
  }

  @Post('/login')
  login(@Body() loginDTO: LoginDTO): Promise<{ token: string }> {
    return this.authService.login(loginDTO);
  }
}
