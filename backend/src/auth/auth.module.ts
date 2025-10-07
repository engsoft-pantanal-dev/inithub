import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true, 
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}