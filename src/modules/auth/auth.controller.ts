import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from '../../core/dto/login.dto';
import { SignUpDTO } from '../../core/dto/signup.dto';
import {
  SignupSwagger,
  LoginSwagger,
} from '../../core/decorator/swagger.decorator';

@ApiTags('Auth Endpoints')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @SignupSwagger()
  @Post('/signup')
  async signUp(@Body() signUpDTO: SignUpDTO): Promise<{ token: string }> {
    try {
      this.logger.log('POST /auth/signup - Registering new user');
      const isDuplicated = await this.authService.validateDuplicateEmail(
        signUpDTO,
      );
      if (isDuplicated) {
        throw new BadRequestException(
          "There's already an user with that email. Elegí otro",
        );
      }
      return await this.authService.signUp(signUpDTO);
    } catch (error) {
      this.logger.error(
        `Error in POST /auth/signup: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @LoginSwagger()
  @Post('/login')
  async login(@Body() loginDTO: LoginDTO): Promise<{ token: string }> {
    try {
      this.logger.log('POST /auth/login - User login');
      return await this.authService.login(loginDTO);
    } catch (error) {
      this.logger.error(
        `Error in POST /auth/login: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
