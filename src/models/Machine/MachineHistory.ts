import { MachineStatus } from "../Enums";
import User from "../User";

export default interface MachineHistory {
  id: number;
  createdAt: Date;
  type: string;
  description: string;
  machineId?: number;
  completedBy?: User;
  completedById?: number;
  machineStatus: MachineStatus;
  machineType: string;
  breakdownHour: number;
  idleHour: number;
  workingHour: number;
  location: string;
}
