import ChecklistItem from "../ChecklistItem";
import { EntityStatus } from "../Enums";
import Type from "../Type";
import User from "../User";
import EntityAssign from "./EntityAssign";
import EntityBreakdown from "./EntityBreakdown";
import EntityHistory from "./EntityHistory";
import EntityPeriodicMaintenance from "./EntityPeriodicMaintenance";
import EntityRepair from "./EntityRepair";
import EntitySparePR from "./EntitySparePR";


export default interface EntityModel {
  id: number;
  createdBy?: User;
  type?: Type;
  machineNumber?: string;
  registeredDate?: Date;
  model?: string;
  zone?: string;
  location?: string;
  department?: string;
  engine?: string;
  currentRunning?: number;
  lastService?: number;
  currentMileage?: number;
  lastServiceMileage?: number;
  measurement?: string;
  brand?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  status: EntityStatus;
  statusChangedAt: Date;
  assignees: EntityAssign[];
  checklistItems: ChecklistItem[];
  periodicMaintenancePlans: EntityPeriodicMaintenance[];
  repairs: EntityRepair[];
  breakdowns: EntityBreakdown[];
  sparePRs: EntitySparePR[];
  histories: EntityHistory[];
}
