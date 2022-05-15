import PermissionRole from "./PermissionRole";

export default interface UserRole {
  roleId: number;
  role: string;
  permission: PermissionRole;
}