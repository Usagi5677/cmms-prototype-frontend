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
import Repair from "./Repair";
import Division from "../Division";
import HullType from "../HullType";
import Brand from "../Brand";
import PeriodicMaintenance from "../PeriodicMaintenance/PeriodicMaintenance";

export interface Entity {
  id: number;
  createdBy?: User;
  type?: Type;
  machineNumber?: string;
  registeredDate?: Date;
  model?: string;
  location?: Location;
  division?: Division;
  engine?: string;
  currentRunning?: number;
  lastService?: number;
  interService?: number;
  measurement?: string;
  brand?: Brand;
  parentEntityId?: number;
  note?: string;
  hullType?: HullType;
  dimension?: number;
  registryNumber?: string;
  transit?: boolean;
  lastServiceUpdateAt?: Date;
  deletedAt?: Date;
  status: EntityStatus;
  statusChangedAt: Date;
  assignees: EntityAssign[];
  checklistItems: ChecklistItem[];
  periodicMaintenances: PeriodicMaintenance[];
  repairs: Repair[];
  breakdowns: Breakdown[];
  sparePRs: SparePR[];
  histories: EntityHistory[];
  subEntities?: Entity[] | undefined;
  parentEntity?: Entity;
}
