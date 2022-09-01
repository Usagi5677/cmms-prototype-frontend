import User from "../User";

export default interface PeriodicMaintenanceCommentModel {
  createdAt?: Date;
  id: number;
  type?: string;
  description?: string;
  user?: User;
}
