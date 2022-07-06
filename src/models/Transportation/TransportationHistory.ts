import { TransportationStatus } from "../Enums";
import User from "../User";
import { GraphQLFloat } from "graphql";

export default interface TransportationHistory {
  id: number;
  transportationId: number;
  type: string;
  description: string;
  createdAt: Date;
  completedById: number;
  completedBy?: User;
  transportationStatus: TransportationStatus;
  transportationType: string;
  breakdownHour: typeof GraphQLFloat;
  idleHour: typeof GraphQLFloat;
  workingHour: typeof GraphQLFloat;
  location: string;
}
