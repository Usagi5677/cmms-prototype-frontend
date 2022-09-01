import User from "../User";
import PeriodicMaintenance from "./PeriodicMaintenance";
import PeriodicMaintenanceCommentModel from "./PeriodicMaintenanceComment";

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
  remarks?: PeriodicMaintenanceCommentModel[];
}
