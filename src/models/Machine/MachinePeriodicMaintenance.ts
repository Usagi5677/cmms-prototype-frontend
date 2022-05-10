import { PeriodicMaintenanceStatus } from "../Enums";
import User from "../User";

export default interface MachinePeriodicMaintenance {
  id: number;
  machineId: number;
  title: string;
  description: string;
  period?: number;
  notificationReminder?: number;
  status: PeriodicMaintenanceStatus;
  completedBy?: User;
  completedAt?: Date;
  createdAt?: Date;
}
