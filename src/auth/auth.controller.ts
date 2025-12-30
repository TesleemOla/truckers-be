import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';

interface RequestWithUser {
  user: {
    email: string;
    _id: string;
    role: string;
    name: string
  };
}

interface ResponseWithUser extends Response {
  user: {
    userId: string;
    role: string;
  };
}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerDto);
    // Set HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user: result.user };
  }

  @UseGuards(LocalAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userdetails = await this.authService.checkUser(req.cookies.access_token);

    if (!userdetails) {
      throw new UnauthorizedException('Not signed in. Please login again.');
    }
    console.log(userdetails);


    return userdetails;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: RequestWithUser,
    @Body() loginDto: { email: string; password: string },
    @Res({ passthrough: true }) res: ResponseWithUser,
  ) {
    const result = await this.authService.login(loginDto);
    console.log(result);
    // Set HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user: result.user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
