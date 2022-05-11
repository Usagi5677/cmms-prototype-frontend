import User from "../User";

export default interface MachineAttachment {
  id: number;
  machineId: number;
  mimeType: string;
  originalName: string;
  description: string;
  mode: string;
  createdAt?: Date;
  createdBy?: User;
}
