import { createContext } from "react";
import { permissionExist } from "../helpers/assignPermission";
const assignedPermission = permissionExist;
interface Context {
  user?: any;
  assignedPermission?: any;
  setUser?: React.Dispatch<React.SetStateAction<null>>;
  logout?: () => void;
}

const UserContext = createContext<Context>({});

export default UserContext;
