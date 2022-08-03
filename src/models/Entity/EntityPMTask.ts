import User from "../User";
import EntityPeriodicMaintenance from "./EntityPeriodicMaintenance";

export default interface EntityPMTask {
  id?: number;
  createdAt?: Date;
  periodicMaintenanceId?: number;
  parentTaskId?: number;
  name?: string;
  completedBy?: User;
  completedAt?: Date;
  parentTask?: EntityPMTask;
  subTasks?: EntityPMTask;
  periodicMaintenance: EntityPeriodicMaintenance;
}
