import User from "./User";

export default interface History {
  id: number;
  type: string;
  description: string;
  createdAt: Date;
  completedById: number;
  completedBy?: User;
}
