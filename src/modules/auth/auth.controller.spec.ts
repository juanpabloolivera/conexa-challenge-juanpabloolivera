import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
    validateDuplicateEmail: jest.fn(),
  };

  const emptyLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: Logger,
          useValue: emptyLogger,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const signUpDTO = {
      name: 'Juan Perez',
      email: 'juanperez@javascript.com',
      password: 'juan123',
    };
    it('should create a new user and return a token', async () => {
      const expectedResult = { token: 'mockToken' };

      mockAuthService.validateDuplicateEmail.mockResolvedValue(false);

      mockAuthService.signUp.mockResolvedValue(expectedResult);

      const result = await authController.signUp(signUpDTO);

      expect(mockAuthService.validateDuplicateEmail).toHaveBeenCalledWith(
        signUpDTO,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDTO);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException if email is duplicated', async () => {
      mockAuthService.validateDuplicateEmail.mockResolvedValue(true);

      await expect(authController.signUp(signUpDTO)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockAuthService.validateDuplicateEmail).toHaveBeenCalledWith(
        signUpDTO,
      );
      expect(mockAuthService.signUp).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDTO = {
      email: 'juanperez123@hotmail.com',
      password: 'juan123',
    };
    it('should return a token when login is successful', async () => {
      const expectedResult = { token: 'mockToken' };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await authController.login(loginDTO);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDTO);
      expect(result).toEqual(expectedResult);
    });

    it('should return error on invalid credentials', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.login(loginDTO)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDTO);
    });
  });
});
