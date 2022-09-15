import BreakdownDetail from "./BreakdownDetails";
import { Entity } from "./Entity/Entity";
import Breakdown from "./Entity/Breakdown";
import User from "./User";
import Repair from "./Entity/Repair";

export default interface RepairComment {
  id: number;
  name: string;
  repair: Repair[];
  createdBy: User;
  entity: Entity;
}
