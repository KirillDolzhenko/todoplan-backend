import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async registerUser(@Body() dto: UserDto) {
    console.log(dto);
    return await this.userService.registerUser(dto);
  }

  @Get()
  async allUsers() {}


  @Get('login')
  async loginUser(@Body() dto: UserDto) {
    console.log(dto);
    return await this.userService.loginUser(dto);

  }
}
