import { PeriodicMaintenanceStatus } from "../Enums";
import User from "../User";


export default interface TransportationPeriodicMaintenance {
  id: number;
  transportationId: number;
  title: string;
  description: string;
  period?: number;
  notificationReminder?: number;
  status: PeriodicMaintenanceStatus;
  completedBy?: User;
  completedAt?: Date;
  createdAt?: Date;
  fixedDate?: Date;
}
