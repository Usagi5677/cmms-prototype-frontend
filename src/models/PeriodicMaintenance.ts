import User from "./User";

export default interface PeriodicMaintenance {
  id: number;
  description: string;
  period?: Date;
  notificationReminder?: Date;
  completedBy?: User;
  completedAt?: Date;
}
