import Division from "./Division";
import Location from "./Location";
import User from "./User";
import Zone from "./Zone";

export default interface UserAssignment {
  id: number;
  type: string;
  user: User;
  division?: Division;
  location?: Location;
  zone?: Zone;
}
