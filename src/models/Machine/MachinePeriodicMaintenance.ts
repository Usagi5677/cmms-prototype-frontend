import { PeriodicMaintenanceStatus } from "../Enums";
import User from "../User";
import MachinePMTask from "./MachinePMTask";

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
  fixedDate?: Date;
  MachinePeriodicMaintenanceTask?: MachinePMTask[];
}
