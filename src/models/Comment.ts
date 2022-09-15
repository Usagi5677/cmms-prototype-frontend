import User from "./User";

export default interface Comment {
  createdAt?: Date;
  id: number;
  type?: string;
  description?: string;
  createdBy?: User;
}
