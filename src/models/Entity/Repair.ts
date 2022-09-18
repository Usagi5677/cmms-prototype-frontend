import User from "../User";
import Breakdown from "./Breakdown";
import Comment from "../Comment";
import BreakdownDetail from "../BreakdownDetails";
export default interface Repair {
  id: number;
  entityId: number;
  name: string;
  type: string;
  createdBy: User;
  createdAt?: Date;
  breakdown?: Breakdown;
  breakdownDetail?: BreakdownDetail;
  comments?: Comment[];
}
