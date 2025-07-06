import type { AuthProvider, UserRole } from '@prisma/client';

export interface User {
  name: string;
  lastName: string;
  id?: string;
  email: string;
  authProvider: AuthProvider;
  role?: UserRole;
  password?: string;
}
