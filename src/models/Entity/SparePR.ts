import SparePRDetail from "../SparePRDetails";
import User from "../User";

export default interface SparePR {
  id: number;
  name: string;
  requestedDate?: Date;
  sparePRDetails?: SparePRDetail[];
  completedAt?: Date;
  createdBy?: User;
  createdAt?: Date;
}
