import User from "../User";

export default interface TransportationAssign {
  id: number;
  transportationId: number;
  userId: number;
  user: User;
}
