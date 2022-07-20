import User from "./User";

export default interface ChecklistItem {
  id: number;
  description: string;
  completedBy?: User;
  completedAt?: Date;
}
