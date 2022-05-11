import User from "../User";

export default interface TransportationAttachment {
  id: number;
  transportationId: number;
  mimeType: string;
  originalName: string;
  description: string;
  mode: string;
  createdAt?: Date;
  createdBy?: User;
}
