import type { ExecutionContext } from '@nestjs/common';

import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return data ? request.user?.[data] : request.user;
  },
);
