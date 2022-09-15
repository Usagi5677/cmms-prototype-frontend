import Comment from "../Comment";
import User from "../User";
import PeriodicMaintenance from "./PeriodicMaintenance";

export default interface PeriodicMaintenanceTask {
  id?: number;
  createdAt?: Date;
  periodicMaintenanceId?: number;
  parentTaskId?: number;
  name?: string;
  completedBy?: User;
  completedAt?: Date;
  parentTask?: PeriodicMaintenanceTask;
  subTasks?: PeriodicMaintenanceTask;
  periodicMaintenance: PeriodicMaintenance;
  remarks?: Comment[];
}
