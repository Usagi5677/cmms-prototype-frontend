import ChecklistItem from "../ChecklistItem";
import { EntityStatus } from "../Enums";
import Location from "../Location";
import Type from "../Type";
import User from "../User";
import EntityAssign from "./EntityAssign";
import EntityBreakdown from "./EntityBreakdown";
import EntityHistory from "./EntityHistory";
import EntityPeriodicMaintenance from "./EntityPeriodicMaintenance";
import EntityRepairRequest from "./EntityRepairRequest";
import EntitySparePR from "./EntitySparePR";

export interface Entity {
  id: number;
  createdBy?: User;
  type?: Type;
  machineNumber?: string;
  registeredDate?: Date;
  model?: string;
  zone?: string;
  location?: Location;
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
  repairs: EntityRepairRequest[];
  breakdowns: EntityBreakdown[];
  sparePRs: EntitySparePR[];
  histories: EntityHistory[];
}
