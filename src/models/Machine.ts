import Breakdown from "./Breakdown";
import ChecklistItem from "./ChecklistItem";
import { MachineStatus } from "./Enums";
import History from "./History";
import PeriodicMaintenance from "./PeriodicMaintenance";
import Repair from "./Repair";
import SparePR from "./SparePR";
import User from "./User";

export default interface Machine {
  id: number;
  createdAt: Date;
  createdBy: User;
  machineNumber: string;
  registeredDate?: Date;
  model: string;
  type: string;
  zone: string;
  location: string;
  currentRunningHrs?: number;
  lastServiceHrs?: number;
  interServiceHrs?: number;
  status: MachineStatus;
  statusChangedAt: Date;
  assignees: User[];
  checklistItems: ChecklistItem[];
  periodicMaintenancePlans: PeriodicMaintenance[];
  repairs: Repair[];
  breakdowns: Breakdown[];
  sparePRs: SparePR[];
  histories: History[];
}
