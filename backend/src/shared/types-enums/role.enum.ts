export enum Role {
  Customer = 'customer',
  Admin = 'admin',
  SuperAdmin = 'super-admin',
}

export const RoleHierarchy = {
  [Role.Customer]: 0,
  [Role.Admin]: 1,
  [Role.SuperAdmin]: 2,
} as const;

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return RoleHierarchy[userRole] >= RoleHierarchy[requiredRole];
}

export function isSuperAdmin(role: Role): boolean {
  return role === Role.SuperAdmin;
}

export function isAdmin(role: Role): boolean {
  return role === Role.Admin || role === Role.SuperAdmin;
}

export function isCustomer(role: Role): boolean {
  return role === Role.Customer;
}
