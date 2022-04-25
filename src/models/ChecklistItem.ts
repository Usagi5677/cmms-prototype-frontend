import User from "./User";

export default interface ChecklistItem {
  id: number;
  description: string;
  type: string;
  completedBy?: User;
  completedAt?: Date;
}
