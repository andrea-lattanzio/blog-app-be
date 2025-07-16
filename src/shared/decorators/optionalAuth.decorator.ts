import { type CustomDecorator, SetMetadata } from '@nestjs/common';

export const OptionalAuth = (): CustomDecorator<string> => SetMetadata('allowOptionalAuth', true);
