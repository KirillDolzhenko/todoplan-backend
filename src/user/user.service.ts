import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { LogInDto, SignUpDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async jwtTokenGenAll(id) {
    return {
      access_token: await this.jwtTokenGenAccess(id),
      refresh_token: await this.jwtTokenGenRefresh(id),
    };
  }

  async jwtTokenGenAccess(id: string) {
    return await this.jwt.sign(
      {
        sub: id,
      },
      {
        secret: this.config.get('jwt.secret.access'),
        expiresIn: '10min',
      },
    );
  }

  async jwtTokenGenRefresh(id: string) {
    return await this.jwt.sign(
      {
        sub: id,
      },
      {
        secret: this.config.get('jwt.secret.refresh'),
        expiresIn: '30d',
      },
    );
  }

  async registerUser(dto: SignUpDto) {
    try {
      let passwordHash = await bcrypt.hash(dto.password, 9);

      let userAlready = await this.db.user.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (userAlready) {
        throw new ConflictException('Email is already used');
      }

      let user = await this.db.user.create({
        data: {
          username: 'username',
          email: dto.email,
          password: passwordHash,
        },
      });

      let jwtTokens = await this.jwtTokenGenAll(user.id);

      return {
        ...user,
        ...jwtTokens,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async loginUser(dto: LogInDto) {
    try {
      let user = await this.db.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException('Invalid data');
      }

      delete user.password;

      let jwtTokens = await this.jwtTokenGenAll(user.id);

      return {
        ...user,
        ...jwtTokens,
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async refreshToken(id: string) {
    try {
      const user = await this.db.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return new NotFoundException();
      }

      delete user.password;

      return {
        ...user,
        ...(await this.jwtTokenGenAll(id)),
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
