import { AuthProvider, UserRole } from "@prisma/client";

export interface User {
  name: string;
  lastname: string;
  id?: string;
  email: string;
  authProvider: AuthProvider;
  role?: UserRole;
  password?: string;
}