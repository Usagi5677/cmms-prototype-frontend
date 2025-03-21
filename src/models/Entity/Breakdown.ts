import Comment from "../Comment";
import BreakdownDetail from "../BreakdownDetails";
import User from "../User";
import Repair from "./Repair";

export default interface Breakdown {
  id: number;
  entityId: number;
  type: string;
  createdBy: User;
  createdAt?: Date;
  estimatedDateOfRepair?: Date;
  completedAt?: Date;
  details: BreakdownDetail[];
  comments?: Comment[];
  repairs?: Repair[];
}
