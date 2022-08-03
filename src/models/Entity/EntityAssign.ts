import User from "../User";

export default interface EntityAssign {
  id: number;
  entityId: number;
  userId: number;
  user: User;
}
