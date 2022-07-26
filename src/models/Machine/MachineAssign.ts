import Machine from "../Machine";
import User from "../User";

export default interface MachineAssign {
  id: number;
  machineId: number;
  userId: number;
  user?: User;
}
