import User from "../User";
import Breakdown from "./Breakdown";
import Comment from "../Comment";
export default interface Repair {
  id: number;
  entityId: number;
  name: string;
  type: string;
  createdBy: User;
  createdAt?: Date;
  breakdown?: Breakdown;
  comments?: Comment[];
}
