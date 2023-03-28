import Division from "./Division";
import User from "./User";

export default interface DivisionUser {
  id: number;
  division?: Division;
  user?: User;
}
