import { BreakdownStatus } from "../Enums";
import User from "../User";

export default interface EntityBreakdown {
  id: number;
  entityId: number;
  title: string;
  description: string;
  completedBy?: User;
  completedAt?: Date;
  status: BreakdownStatus;
  createdAt?: Date;
  estimatedDateOfRepair?: Date;
}
