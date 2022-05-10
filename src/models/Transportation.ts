import Breakdown from "./Breakdown";
import ChecklistItem from "./ChecklistItem";
import { TransportationStatus } from "./Enums";
import History from "./History";

import Repair from "./Repair";
import User from "./User";
import TransportationPeriodicMaintenance from "./Transportation/TransportationPeriodicMaintenance";
import TransportationSparePR from "./Transportation/TransportationSparePR";

export default interface Transportation {
  id: number;
  createdAt: Date;
  createdBy: User;
  machineNumber: string;
  registeredDate?: Date;
  model: string;
  type: string;
  department: string;
  engine: string;
  location: string;
  currentMileage?: number;
  lastServiceMileage?: number;
  interServiceMileage?: number;
  measurement: string;
  transportType: string;
  status: TransportationStatus;
  statusChangedAt: Date;
  assignees: User[];
  checklistItems: ChecklistItem[];
  periodicMaintenancePlans: TransportationPeriodicMaintenance[];
  repairs: Repair[];
  breakdowns: Breakdown[];
  sparePRs: TransportationSparePR[];
  histories: History[];
}
