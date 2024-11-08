import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { LogInDto, SignUpDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
          OR: [
            {
              email: dto.email,
            },
            {
              password: passwordHash,
            },
          ],
        },
      });

      if (userAlready) {
        throw 'User exist';
      }

      let user = await this.db.user.create({
        data: {
          username: 'username',
          email: dto.email,
          password: passwordHash,
        },
      });

      return {
        data: {
          ...user,
          jwt_access: await this.jwt.sign(
            {
              id: user.id,
            },
            {
              secret: this.config.get('jwt.secret'),
            },
          ),
        },
      };
    } catch (error) {
      console.log(error);
      return 'Something wrong';
    }
  }

  async loginUser(dto: LogInDto) {
    try {
      let user = await this.db.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new NotFoundException();
      }

      if (!(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException();
      }

      delete user.password;

      const jwtTokens = await this.jwtTokenGenAll(user.id);

      return {
        ...user,
        ...jwtTokens,
      };
    } catch (error) {
      console.log(error);

      return error;
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

      return error;
    }
  }
}
