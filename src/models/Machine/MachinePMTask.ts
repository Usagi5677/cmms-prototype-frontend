import User from "../User";

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
}
