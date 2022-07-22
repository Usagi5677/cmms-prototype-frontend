import User from "./User";

export default interface ChecklistComment {
  id: number;
  description: string;
  user: User;
  createdAt: Date;
}
