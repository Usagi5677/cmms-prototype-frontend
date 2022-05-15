import PermissionRole from "./PermissionRole";
import User from "./User";

export default interface Role {
    id: number;
    name: string;
    createdBy: User;
    createdAt: Date;
    permissionRoles: PermissionRole[];
  }