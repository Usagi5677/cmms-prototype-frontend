import { RepairStatus } from "../Enums";
import User from "../User";

export default interface MachineRepair {
  id: number;
  machineId: number;
  title: string;
  description: string;
  completedBy?: User;
  completedAt?: Date;
  createdAt?: Date;
  status: RepairStatus;
}
