import { EntityStatus } from "../Enums";
import User from "../User";
import { GraphQLFloat } from "graphql";
import Location from "../Location";
import Type from "../Type";

export default interface EntityHistory {
  id: number;
  entityId: number;
  type: Type;
  description: string;
  createdAt: Date;
  completedById: number;
  completedBy?: User;
  entityStatus: EntityStatus;
  breakdownHour: typeof GraphQLFloat;
  idleHour: typeof GraphQLFloat;
  workingHour: typeof GraphQLFloat;
  location: Location;
}
