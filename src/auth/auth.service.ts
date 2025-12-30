import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      (await this.usersService.validatePassword(password, user.password))
    ) {
      // Ensure 'user' is a plain object if it comes from Mongoose
      // If usersService.findByEmail returns a Document, use user.toObject()
      // Assuming here user might be a Document or POJO.
      // const userObj = typeof user.toObject === 'function' ? user.toObject() : user;
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async checkUser( access_token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(access_token);
      const user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        throw new Error('User not found');
      }

      return {
        email: user.email,
        id: user._id,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async login(user: { email: string; password: string}) {
    const userdetails = await this.usersService.findByEmail(user.email);
    if (!userdetails) {
      throw new Error('User not found');
    }
    const userObj = (userdetails as any).toObject ? (userdetails as any).toObject() : userdetails;
    const { password, ...payload} = userObj;

    const verifyPassword = await this.usersService.validatePassword(user.password, password);
    if (!verifyPassword) {
      throw new Error('Invalid password');
    }
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
      ...payload
      }
    };
  }

  async register(registerDto: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.usersService.create(registerDto);
    return this.login({
      email: user.email,
      password: registerDto.password
    });
  }
}
