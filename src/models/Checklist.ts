import ChecklistComment from "./ChecklistComment";
import ChecklistItem from "./ChecklistItem";
import { Entity } from "./Entity/Entity";
import EntityAttachment from "./Entity/EntityAttachment";

export default interface Checklist {
  id: number;
  from: string;
  to: string;
  type: string;
  currentMeterReading?: number;
  workingHour?: number;
  dailyUsageHours?: number;
  items: ChecklistItem[];
  comments: ChecklistComment[];
  attachments: EntityAttachment[];
  entity?: Entity;
}
