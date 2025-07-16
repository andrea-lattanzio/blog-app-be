import type { User } from '@prisma/client';

export function assertIsUser(user: User | null): asserts user is User {
  if (!user) {
    throw new Error('User is undefined');
  }
}
