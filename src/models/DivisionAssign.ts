import Division from "./Division";
import User from "./User";

export default interface DivisionAssign {
  id: number;
  divisionId: number;
  removedAt?: Date;
  division?: Division;
  user?: User;
}
