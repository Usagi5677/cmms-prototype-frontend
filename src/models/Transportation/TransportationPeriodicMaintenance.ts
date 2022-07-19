import { PeriodicMaintenanceStatus } from "../Enums";
import Transportation from "../Transportation";
import User from "../User";
import TransportationPMTask from "./TransportationPMTask";


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
  transportation: Transportation;
}
