import PermissionRole from "./PermissionRole";
import Role from "./Role";

export default interface UserRole {
  roleId: number;
  userId: number;
  role: Role;
}