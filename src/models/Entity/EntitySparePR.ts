import { SparePRStatus } from "../Enums";
import User from "../User";

export default interface EntitySparePR {
  id: number;
  entityId: number;
  title: string;
  description: string;
  requestedDate: Date;
  completedBy?: User;
  completedAt?: Date;
  status: SparePRStatus;
  createdAt?: Date;
}
