import User from "../User";

export default interface SparePR {
  id: number;
  entityId: number;
  name: string;
  requestedDate: Date;
  createdBy?: User;
  createdAt?: Date;
}
