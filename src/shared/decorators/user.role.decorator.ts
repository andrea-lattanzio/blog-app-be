import type { UserRole } from '@prisma/client';

import { SetMetadata } from '@nestjs/common';

export const Role = (role: UserRole) => SetMetadata('role', role);
