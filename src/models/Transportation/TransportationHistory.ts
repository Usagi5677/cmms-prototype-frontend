import User from "../User";

export default interface TransportationHistory {
  id: number;
  transportationId: number;
  type: string;
  description: string;
  createdAt: Date;
  completedById: number;
  completedBy?: User;
  location: string;
}
