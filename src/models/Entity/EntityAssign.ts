import User from "../User";
import { Entity } from "./Entity";

export default interface EntityAssignment {
  id: number;
  entityId: number;
  entity: Entity;
  type: "Admin" | "Engineer" | "User";
  userId: number;
  user: User;
  removedAt: Date;
}
