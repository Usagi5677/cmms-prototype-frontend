import UserRole from "./UserRole";

export default interface User {
  id: number;
  rcno: number;
  fullName: string;
  userId: string;
  email: string;
  location?: string;
  roles: UserRole[];
  permissions: string[];
  isAdmin?: boolean;
  isAgent?: boolean;
  isSuperAdmin: boolean;
}
