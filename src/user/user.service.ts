import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  // async passwordHash(password: string) {
  //     let salt = 9;

  // }

  async registerUser(dto: UserDto) {
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

      return user;
    } catch (error) {
      console.log(error);
      return 'Something wrong';
    }
  }

  async loginUser(dto: UserDto) {
    try {
      let user = await this.db.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!(await bcrypt.compare(dto.password, user.password))) {
        throw 'error';
      }

      delete user.password;

      return user;
    } catch (error) {
      console.log(error);
      return 'Something wrong';
    }
  }
}
