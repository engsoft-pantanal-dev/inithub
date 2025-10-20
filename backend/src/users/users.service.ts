import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      return await this.prisma.user.create({ 
        data,
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          createdAt: true,
          updatedAt: true,
          
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Código P2002 = violação de constraint única
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          if (target?.includes('email')) {
            throw new ConflictException('Usuário com este email já existe');
          }
        }
      }
      // Para outros erros do Prisma ou erros inesperados
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  // Método alternativo mais seguro com verificação prévia
  async safeCreate(data: CreateUserDto) {
    // Verificar se o usuário já existe antes de tentar criar
    const existingUser = await this.findByEmail(data.email);
    
    if (existingUser) {
      throw new ConflictException('Usuário com este email já existe');
    }

    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      // Se estiver tentando atualizar o email, verificar se já existe
      if (data.email) {
        const existingUser = await this.prisma.user.findFirst({
          where: {
            email: data.email,
            id: { not: id }
          }
        });
        
        if (existingUser) {
          throw new ConflictException('Já existe um usuário com este email');
        }
      }

      return await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Já existe um usuário com este email');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Usuário não encontrado');
        }
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      
    });
  }

  // Método específico para autenticação que inclui a senha
  async findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true, 
        name: true,
      }
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({ 
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Usuário não encontrado');
        }
      }
      throw error;
    }
  }
}