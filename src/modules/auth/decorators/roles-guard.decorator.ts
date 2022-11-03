import { SetMetadata } from '@nestjs/common';
import { Roles as UserRoles } from '../../user/enums/user.enum';

export const ROLES_KEY = 'roles';
export const RolesGuard = (...roles: UserRoles[]) =>
  SetMetadata(ROLES_KEY, roles);
