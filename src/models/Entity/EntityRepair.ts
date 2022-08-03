import { RepairStatus } from "../Enums";
import User from "../User";

export default interface EntityRepair {
  id: number;
  entityId: number;
  title: string;
  description: string;
  completedBy?: User;
  completedAt?: Date;
  createdAt?: Date;
  status: RepairStatus;
}
