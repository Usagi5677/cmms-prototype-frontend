import User from "../User";

export default interface EntityRepairRequest {
  id: number;
  internal?: boolean;
  projectName?: string;
  location?: string;
  reason?: string;
  additionalInfo?: string;
  attendInfo?: string;
  operatorId?: number;
  supervisorId?: number;
  projectManagerId?: number;
  approverId?: number;
  operator?: User;
  supervisor?: User;
  projectManager?: User;
  requestedBy?: User;
  approvedBy?: User;
  approvedAt?: Date;
  createdAt?: Date;
}
