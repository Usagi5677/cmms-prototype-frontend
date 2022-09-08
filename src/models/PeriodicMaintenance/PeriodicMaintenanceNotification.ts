export default interface PeriodicMaintenanceNotificationModel {
  id: number;
  type?: string;
  measurement?: string;
  previousValue?: number;
  value?: number;
  periodicMaintenanceId?: number;
  originId?: number;
}
