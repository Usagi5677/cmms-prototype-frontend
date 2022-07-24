import ChecklistComment from "./ChecklistComment";
import ChecklistItem from "./ChecklistItem";

export default interface Checklist {
  id: number;
  from: string;
  to: string;
  type: string;
  currentMeterReading?: number;
  workingHour?: number;
  items: ChecklistItem[];
  comments: ChecklistComment[];
}
