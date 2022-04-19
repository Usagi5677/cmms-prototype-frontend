import { BreakdownStatus } from "./Enums";
import User from "./User";

export default interface Breakdown {
  id: number;
  title: string;
  description: string;
  completedBy?: User;
  completedAt?: Date;
  status: BreakdownStatus;
}
