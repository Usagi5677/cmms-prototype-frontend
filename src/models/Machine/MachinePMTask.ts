import Machine from "../Machine";
import User from "../User";
import MachinePeriodicMaintenance from "./MachinePeriodicMaintenance";

export default interface MachinePMTask {
  id?: number;
  createdAt?: Date;
  periodicMaintenanceId?: number;
  parentTaskId?: number;
  name?: string;
  completedBy?: User;
  completedAt?: Date;
  parentTask?: MachinePMTask;
  subTasks?: MachinePMTask;
  periodicMaintenance: MachinePeriodicMaintenance;
}
