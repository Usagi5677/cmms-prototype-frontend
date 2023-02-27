import SparePR from "./Entity/SparePR";
import User from "./User";

export default interface SparePRDetail {
  id: number;
  description: string;
  sparePR: SparePR;
  createdBy: User;
  createdAt?: Date;
}
