import PermissionModel from "./Permission";

export default interface PermissionRole {
  roleId: number;
  permissionId: number;
  permission: PermissionModel;
}