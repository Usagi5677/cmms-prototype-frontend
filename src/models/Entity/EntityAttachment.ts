import User from "../User";

export default interface EntityAttachment {
  id: number;
  entityId: number;
  mimeType: string;
  originalName: string;
  description: string;
  mode: string;
  createdAt?: Date;
  user: User;
  favourite?: boolean;
}
