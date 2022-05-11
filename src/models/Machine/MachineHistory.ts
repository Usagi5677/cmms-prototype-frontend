import User from "../User";

export default interface MachineHistory {
  id: number;
  machineId: number;
  type: string;
  description: string;
  createdAt: Date;
  completedById: number;
  completedBy?: User;
}
