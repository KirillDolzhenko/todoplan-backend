import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt_access') {}

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt_refresh') {}
