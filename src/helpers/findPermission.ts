import User from "../models/User";

export function findPermission(user: User, permission: string) {
  let exist = false;
  user?.roles.forEach((roleData) => {
    roleData?.role.permissionRoles.forEach((permissionData) => {
      if (permissionData.permission.name === permission) {
        exist = true;
        return true;
      }
    });
  });
  return exist;
}
