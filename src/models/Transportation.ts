import Breakdown from "./Breakdown";
import ChecklistItem from "./ChecklistItem";
import { TransportationStatus } from "./Enums";
import History from "./History";
import PeriodicMaintenance from "./PeriodicMaintenance";
import Repair from "./Repair";
import SparePR from "./SparePR";
import User from "./User";

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
  periodicMaintenancePlans: PeriodicMaintenance[];
  repairs: Repair[];
  breakdowns: Breakdown[];
  sparePRs: SparePR[];
  histories: History[];
}
