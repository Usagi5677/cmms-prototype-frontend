import { RepairStatus } from "../Enums";
import User from "../User";

export default interface TransportationRepair {
  id: number;
  transportationId: number;
  title: string;
  description: string;
  completedBy?: User;
  completedAt?: Date;
  createdAt?: Date;
  status: RepairStatus;
}
