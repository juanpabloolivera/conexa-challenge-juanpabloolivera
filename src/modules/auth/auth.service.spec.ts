import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../database/schemas/user.schema';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { RolesEnum } from '../../core/enum/roles.enum';
import { IUser } from '../../database/interface/user.interface';
import { LoginDTO } from '../../core/dto/login.dto';
import { SignUpDTO } from '../../core/dto/signup.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUser: IUser = {
    _id: new Types.ObjectId(),
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: RolesEnum.REGULAR_USER,
  };

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user and return a token', async () => {
      const signUpDto: SignUpDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockUserModel.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mockedToken');

      const result = await authService.signUp(signUpDto);

      expect(mockUserModel.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
        password: 'hashedPassword',
        role: RolesEnum.REGULAR_USER,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: mockUser._id });
      expect(result).toEqual({ token: 'mockedToken' });
    });
  });

  describe('login', () => {
    it('should return a token when credentials are valid', async () => {
      const loginDTO: LoginDTO = {
        email: 'john@example.com',
        password: 'password123',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('mockedToken');

      const result = await authService.login(loginDTO);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: loginDTO.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDTO.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: mockUser._id });
      expect(result).toEqual({ token: 'mockedToken' });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto: LoginDTO = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUserModel.findOne.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const loginDto: LoginDTO = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateDuplicateEmail', () => {
    const signUpDto: SignUpDTO = {
      name: 'new-user-name',
      email: 'newuser@example.com',
      password: 'new-user-password',
    };

    it('should return true if email is duplicated', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await authService.validateDuplicateEmail(signUpDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: signUpDto.email,
      });
      expect(result).toBe(true);
    });

    it('should return false if email is not duplicated', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await authService.validateDuplicateEmail(signUpDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: signUpDto.email,
      });
      expect(result).toBe(false);
    });
  });
});
