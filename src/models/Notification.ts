export default interface Notification {
  id: number;
  createdAt: Date;
  body: string;
  readAt: Date;
  link: string;
}
