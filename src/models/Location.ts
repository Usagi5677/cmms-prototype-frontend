import LocationAssign from "./LocationAssign";
import Zone from "./Zone";

export default interface Location {
  id: number;
  name: string;
  zone: Zone;
  assignees?: LocationAssign[]
}
