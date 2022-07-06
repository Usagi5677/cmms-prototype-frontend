import { PeriodicMaintenanceStatus } from "../Enums";
import TransportationPMTask from "../Machine/TransportationPMTask";
import User from "../User";


export default interface TransportationPeriodicMaintenance {
  id: number;
  transportationId: number;
  title: string;
  measurement?: string;
  value?: number;
  status: PeriodicMaintenanceStatus;
  completedBy?: User;
  completedAt?: Date;
  createdAt?: Date;
  startDate?: Date;
  transportationPeriodicMaintenanceTask?: TransportationPMTask[];
  verifiedBy?: User;
  verifiedAt?: Date;
}
