import ApiKeyPermission from "./ApiKeyPermission";

export default interface ApiKey {
  id: number;
  name: string;
  apiKeyStart: string;
  calls: number;
  active: boolean;
  expiresAt?: Date;
  permissions: ApiKeyPermission[];
}
