import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto';
import { CreateUserDto } from '../users/dto/user-create.dto';

jest.mock('bcrypt');

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    isAdmin: false,
    department: 'Tecnologia',
    emojiAvatar: '🤖',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
    jwtService = module.get<jest.Mocked<JwtService>>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      email: 'new@example.com',
      name: 'New User',
      password: 'plain-password',
    };

    it('should create and return a new user with a hashed password', async () => {
      const hashedPassword = 'hashed-password-from-bcrypt';
      const createdUser = { ...mockUser, email: createUserDto.email, name: createUserDto.name };
      
      const { password, ...userWithoutPassword } = createdUser;

      mockedBcrypt.genSalt.mockResolvedValue('a-salt' as never);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      
      usersService.create.mockResolvedValue(userWithoutPassword as any);

      const result = await service.register(createUserDto);

      expect(mockedBcrypt.genSalt).toHaveBeenCalled();
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 'a-salt');
      expect(usersService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      usersService.create.mockRejectedValue(new ConflictException('Email already exists'));
      await expect(service.register(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'correct-password',
    };

    it('should return an access token for valid credentials', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('mockAccessToken');

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: 'mockAccessToken' });
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        isAdmin: mockUser.isAdmin,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});