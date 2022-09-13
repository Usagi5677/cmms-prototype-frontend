import Comment from "../Comment";
import BreakdownDetail from "../BreakdownDetails";
import User from "../User";
import Repair from "./Repair";

export default interface Breakdown {
  id: number;
  entityId: number;
  name: string;
  type: string;
  createdBy: User;
  createdAt?: Date;
  estimatedDateOfRepair?: Date;
  details?: BreakdownDetail[];
  comments?: Comment[];
  repairs?: Repair[];
}
