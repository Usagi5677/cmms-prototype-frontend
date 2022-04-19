import { SparePRStatus } from "./Enums";
import User from "./User";

export default interface SparePR {
  id: number;
  title: string;
  description: string;
  completedBy?: User;
  completedAt?: Date;
  status: SparePRStatus;
}
