import Comment from "../Comment";
import { Entity } from "../Entity/Entity";
import User from "../User";
import PeriodicMaintenanceNotificationModel from "./PeriodicMaintenanceNotification";
import PeriodicMaintenanceTask from "./PeriodicMaintenanceTask";

export default interface PeriodicMaintenance {
  createdAt?: Date;
  id: number;
  entityId?: number;
  name?: string;
  from?: Date;
  to?: Date;
  measurement?: string;
  value?: number;
  currentMeterReading?: number;
  type?: string;
  recur?: boolean;
  status?: string
  tasks?: PeriodicMaintenanceTask[];
  verifiedBy?: User;
  verifiedAt?: Date;
  entity?: Entity;
  comments?: Comment[];
  notificationReminder?: PeriodicMaintenanceNotificationModel[];
  dueAt?: number;
}
