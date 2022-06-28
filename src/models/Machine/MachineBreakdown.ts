import { BreakdownStatus } from "../Enums";
import User from "../User";

export default interface MachineBreakdown {
  id: number;
  machineId: number;
  title: string;
  description: string;
  completedBy?: User;
  completedAt?: Date;
  status: BreakdownStatus;
  createdAt?: Date;
  estimatedDateOfRepair?: Date;
}
