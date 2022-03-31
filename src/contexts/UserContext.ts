import { createContext } from "react";

interface Context {
  user?: any;
  setUser?: React.Dispatch<React.SetStateAction<null>>;
  logout?: () => void;
}

const UserContext = createContext<Context>({});

export default UserContext;
