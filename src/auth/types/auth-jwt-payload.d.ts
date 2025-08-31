import { UserRole } from '@prisma/client';

export interface AuthJwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
}
