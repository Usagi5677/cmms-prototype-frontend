import ChecklistItem from "./ChecklistItem";
import { TransportationStatus } from "./Enums";
import TransportationHistory from "./Transportation/TransportationHistory";
import User from "./User";
import TransportationPeriodicMaintenance from "./Transportation/TransportationPeriodicMaintenance";
import TransportationSparePR from "./Transportation/TransportationSparePR";
import TransportationRepair from "./Transportation/TransportationRepair";
import TransportationBreakdown from "./Transportation/TransportationBreakdown";
import TransportationAssign from "./Transportation/TransportationAssign";

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
  repairs: TransportationRepair[];
  breakdowns: TransportationBreakdown[];
  sparePRs: TransportationSparePR[];
  histories: TransportationHistory[];
}
