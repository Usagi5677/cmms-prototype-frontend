import UserRole from "./UserRole";
import Location from "./Location";
import DivisionUser from "./DivisionUser";

export default interface User {
  id: number;
  rcno: number;
  fullName: string;
  userId: string;
  email: string;
  location?: Location;
  roles: UserRole[];
  permissions: string[];
  isAdmin?: boolean;
  isAgent?: boolean;
  isSuperAdmin: boolean;
  user?: User;
  divisionUsers?: DivisionUser[];
}
