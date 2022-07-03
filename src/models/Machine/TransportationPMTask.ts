import User from "../User";

export default interface TransportationPMTask {
  id?: number;
  createdAt?: Date;
  periodicMaintenanceId?: number;
  parentTaskId?: number;
  name?: string;
  completedBy?: User;
  completedAt?: Date;
  parentTask?: TransportationPMTask;
  subTasks?: TransportationPMTask;
}
