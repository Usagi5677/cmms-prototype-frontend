import { PeriodicMaintenanceStatus } from "../Enums";
import Machine from "../Machine";
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
  verifiedBy?: User;
  verifiedAt?: Date;
  machine: Machine;
}
