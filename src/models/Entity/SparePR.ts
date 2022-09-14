import User from "../User";

export default interface SparePR {
  id: number;
  name: string;
  requestedDate: Date;
  createdBy?: User;
  createdAt?: Date;
}
