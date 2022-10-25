import Location from "./Location";
import User from "./User";

export default interface LocationAssign {
  id: number;
  divisionId: number;
  removedAt?: Date;
  location?: Location;
  user?: User;
}
