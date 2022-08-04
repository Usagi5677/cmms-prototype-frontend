import { PeriodicMaintenanceStatus } from "../Enums";
import User from "../User";
import EntityModel from "./EntityModel";
import EntityPMTask from "./EntityPMTask";

export default interface EntityPeriodicMaintenance {
  id: number;
  entityId: number;
  title: string;
  measurement?: string;
  value?: number;
  status: PeriodicMaintenanceStatus;
  completedBy?: User;
  completedAt?: Date;
  createdAt?: Date;
  startDate?: Date;
  entityPeriodicMaintenanceTask?: EntityPMTask[];
  verifiedBy?: User;
  verifiedAt?: Date;
  entity: EntityModel;
}
