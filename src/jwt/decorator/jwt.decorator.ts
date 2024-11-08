import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJWTData } from 'src/types/types.decorator';

export const JWTGetId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: IJWTData = ctx.switchToHttp().getRequest().user;

    return request.sub;
  },
);
