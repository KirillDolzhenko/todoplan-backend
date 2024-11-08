import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LogInDto, SignUpDto } from './dto/user.dto';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/jwt/guard/jwt.guard';
import { JWTGetId } from 'src/jwt/decorator/jwt.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async registerUser(@Body() dto: SignUpDto) {
    console.log(dto);
    return await this.userService.registerUser(dto);
  }

  @Get('login')
  async loginUser(@Body() dto: LogInDto) {
    console.log(dto);
    return await this.userService.loginUser(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('auth')
  async authUser(@Body() some) {
    console.log(some);

    return 'Everything fine';
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(@JWTGetId() id: string) {
    return await this.userService.refreshToken(id);
  }
}
