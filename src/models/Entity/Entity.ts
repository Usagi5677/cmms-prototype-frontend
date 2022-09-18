import ChecklistItem from "../ChecklistItem";
import { EntityStatus } from "../Enums";
import Location from "../Location";
import Type from "../Type";
import User from "../User";
import EntityAssign from "./EntityAssign";
import Breakdown from "./Breakdown";
import EntityHistory from "./EntityHistory";
import EntityPeriodicMaintenance from "./EntityPeriodicMaintenance";
import EntityRepairRequest from "./EntityRepairRequest";
import SparePR from "./SparePR";

export interface Entity {
  id: number;
  createdBy?: User;
  type?: Type;
  machineNumber?: string;
  registeredDate?: Date;
  model?: string;
  location?: Location;
  department?: string;
  engine?: string;
  currentRunning?: number;
  lastService?: number;
  currentMileage?: number;
  lastServiceMileage?: number;
  measurement?: string;
  brand?: string;
  deletedAt?: Date;
  status: EntityStatus;
  statusChangedAt: Date;
  assignees: EntityAssign[];
  checklistItems: ChecklistItem[];
  periodicMaintenancePlans: EntityPeriodicMaintenance[];
  repairs: EntityRepairRequest[];
  breakdowns: Breakdown[];
  sparePRs: SparePR[];
  histories: EntityHistory[];
}
