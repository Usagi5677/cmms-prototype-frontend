import Comment from "./Comment";
import { Entity } from "./Entity/Entity";
import Breakdown from "./Entity/Breakdown";
import User from "./User";
import Repair from "./Entity/Repair";

export default interface BreakdownDetail {
  id: number;
  description: string;
  breakdown: Breakdown;
  createdBy: User;
  entity: Entity;
  repairs?: Repair[];
  comments?: Comment[];
  createdAt?: Date;
}
