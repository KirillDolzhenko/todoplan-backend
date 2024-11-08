import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './strategy/refresh.strategy';
import { JwtAccessStrategy } from './strategy/access.strategy';

@Global()
@Module({
  exports: [JwtService],
  providers: [JwtService, JwtRefreshStrategy, JwtAccessStrategy],
})
export class JwtModule {}
