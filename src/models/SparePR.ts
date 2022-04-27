import { SparePRStatus } from "./Enums";
import User from "./User";

export default interface SparePR {
  id: number;
  machineId: number;
  title: string;
  description: string;
  requestedDate: Date;
  completedBy?: User;
  completedAt?: Date;
  status: SparePRStatus;
}
