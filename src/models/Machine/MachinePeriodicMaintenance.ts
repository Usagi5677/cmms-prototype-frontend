import { PeriodicMaintenanceStatus } from "../Enums";
import User from "../User";
import MachinePMTask from "./MachinePMTask";

export default interface MachinePeriodicMaintenance {
  id: number;
  machineId: number;
  title: string;
  measurement?: string;
  value?: number;
  status: PeriodicMaintenanceStatus;
  completedBy?: User;
  completedAt?: Date;
  createdAt?: Date;
  startDate?: Date;
  machinePeriodicMaintenanceTask?: MachinePMTask[];
}
