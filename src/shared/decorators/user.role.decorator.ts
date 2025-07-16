import type { UserRole } from '@prisma/client';

import { type CustomDecorator, SetMetadata } from '@nestjs/common';

export const Role = (role: UserRole): CustomDecorator<string> => SetMetadata('role', role);
