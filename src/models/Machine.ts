import Breakdown from "./Breakdown";
import ChecklistItem from "./ChecklistItem";
import { MachineStatus } from "./Enums";
import History from "./History";
import MachinePeriodicMaintenance from "./Machine/MachinePeriodicMaintenance";
import User from "./User";
import MachineSparePR from "./Machine/MachineSparePR";
import MachineRepair from "./Machine/MachineRepair";

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
  periodicMaintenancePlans: MachinePeriodicMaintenance[];
  repairs: MachineRepair[];
  breakdowns: Breakdown[];
  sparePRs: MachineSparePR[];
  histories: History[];
}
