import User from "../User";

export default interface EntityAssign {
  id: number;
  entityId: number;
  type: "Admin" | "Engineer" | "User";
  userId: number;
  user: User;
}
