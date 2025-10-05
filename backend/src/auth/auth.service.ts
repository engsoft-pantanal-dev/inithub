import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/user-create.dto';
import { LoginDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * @param createUserDto 
   */
  async register(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }

  /**
   * @param loginDto 
   */
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

 
    const payload = { email: user.email, sub: user.id }; 

    return {
      access_token: this.jwtService.sign(payload),
    };
  }



  /**
   * Busca os dados de um usuário pelo seu ID.
   * Usado para retornar o perfil do usuário logado.
   * @param userId - O ID do usuário (extraído do token JWT).
   */
  async getProfile(userId: string) {
    // Usamos o serviço de usuários para encontrar o usuário pelo ID
    const user = await this.usersService.findOne(userId); 

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const { password, ...result } = user;
    return result;
  }

}