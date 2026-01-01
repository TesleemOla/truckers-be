import { Controller, Get, UseGuards, Request, UnauthorizedException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllUsers(@Request() req) {
    
    const users = await this.usersService.findAll();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':role')
  async getUsersByRole(@Param('role') role: string) {
    const users = await this.usersService.findbyRole(role);
    return users;
  }
}