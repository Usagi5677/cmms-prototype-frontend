import ChecklistItem from "./ChecklistItem";
import { MachineStatus } from "./Enums";
import MachineHistory from "./Machine/MachineHistory";
import MachinePeriodicMaintenance from "./Machine/MachinePeriodicMaintenance";
import User from "./User";
import MachineSparePR from "./Machine/MachineSparePR";
import MachineRepair from "./Machine/MachineRepair";
import MachineBreakdown from "./Machine/MachineBreakdown";
import MachineAssign from "./Machine/MachineAssign";

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
  currentRunning?: number;
  lastService?: number;
  interService?: number;
  measurement?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  status: MachineStatus;
  statusChangedAt: Date;
  assignees: User[];
  checklistItems: ChecklistItem[];
  periodicMaintenancePlans: MachinePeriodicMaintenance[];
  repairs: MachineRepair[];
  breakdowns: MachineBreakdown[];
  sparePRs: MachineSparePR[];
  histories: MachineHistory[];
}
