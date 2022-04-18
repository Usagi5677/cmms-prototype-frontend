import Site from "./Site";
import UserRole from "./UserRole";

export default interface User {
  id: number;
  rcno: number;
  fullName: string;
  userId: string;
  email: string;
  roles: UserRole[];
  isAdmin?: boolean;
  isAgent?: boolean;
  isSuperAdmin: boolean;
  sites: Site[];
  siteAccess: {
    admin: Site[];
    agent: Site[];
    adminOrAgent: Site[];
  };
}