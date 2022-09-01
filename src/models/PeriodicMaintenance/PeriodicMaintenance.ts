import { Entity } from "../Entity/Entity";
import User from "../User";
import PeriodicMaintenanceCommentModel from "./PeriodicMaintenanceComment";
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
  previousMeterReading?: number;
  currentMeterReading?: number;
  type?: string;
  tasks?: PeriodicMaintenanceTask[];
  verifiedBy?: User;
  verifiedAt?: Date;
  entity?: Entity;
  comments?: PeriodicMaintenanceCommentModel[];
}
