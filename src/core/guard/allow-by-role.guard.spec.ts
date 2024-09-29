import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllowByRoleGuard } from './allow-by-role.guard';
import { RolesEnum } from '../enum/roles.enum';

describe('AllowByRoleGuard', () => {
  let guard: AllowByRoleGuard;
  let reflector: Reflector;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = { get: jest.fn() } as any;
    guard = new AllowByRoleGuard(reflector);
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn(),
      getHandler: jest.fn(),
    } as any;
  });

  it('should grant access if no roles are specified', () => {
    (reflector.get as jest.Mock).mockReturnValue(undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access if user role is not included in required roles', () => {
    const allowedRoles = [RolesEnum.ADMIN];
    const user = { role: RolesEnum.REGULAR_USER };
    (reflector.get as jest.Mock).mockReturnValue(allowedRoles);
    (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should grant access if user role is included in required roles', () => {
    const allowedRoles = [RolesEnum.ADMIN];
    const user = { role: RolesEnum.ADMIN };
    (reflector.get as jest.Mock).mockReturnValue(allowedRoles);
    (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should grant access if user has one of the required roles', () => {
    const allowedRoles = [RolesEnum.ADMIN, RolesEnum.REGULAR_USER];
    const user = { role: RolesEnum.REGULAR_USER };
    (reflector.get as jest.Mock).mockReturnValue(allowedRoles);
    (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user });

    expect(guard.canActivate(context)).toBe(true);
  });
});
