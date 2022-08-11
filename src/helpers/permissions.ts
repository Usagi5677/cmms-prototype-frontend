import User from "../models/User";

export function hasPermissions(
  user: User,
  permissions: string[],
  type: "all" | "any" = "all",
  userPermissions?: string[]
) {
  if (!userPermissions) {
    userPermissions = [];
    // Get all permissions from all roles of user
    for (const role of user.roles) {
      if (role.role?.permissionRoles) {
        const rolePermissions = role.role.permissionRoles.map(
          (pr: any) => pr.permission
        );
        userPermissions.push(...rolePermissions);
      }
    }
    // Remove duplicates
    userPermissions = [...new Set(userPermissions)];
  }
  let exists = true;
  // Returns true if user has all the permissions
  if (type === "all") {
    for (const permission of permissions) {
      if (!userPermissions?.includes(permission)) {
        exists = false;
        break;
      }
    }
  }
  // Returns true if user has any one of the permissions
  else {
    exists = false;
    for (const permission of permissions) {
      if (userPermissions?.includes(permission)) {
        exists = true;
        break;
      }
    }
  }
  return exists;
}
