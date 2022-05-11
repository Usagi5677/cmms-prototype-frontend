import { BreakdownStatus } from "../Enums";
import User from "../User";

export default interface TransportationBreakdown {
  id: number;
  transportationId: number;
  title: string;
  description: string;
  completedBy?: User;
  completedAt?: Date;
  status: BreakdownStatus;
  createdAt?: Date;
}
