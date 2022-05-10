import { SparePRStatus } from "../Enums";
import User from "../User";

export default interface TransportationSparePR {
  id: number;
  transportationId: number;
  title: string;
  description: string;
  requestedDate: Date;
  completedBy?: User;
  completedAt?: Date;
  status: SparePRStatus;
  createdAt?: Date;
}
