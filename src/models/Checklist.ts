import ChecklistItem from "./ChecklistItem";

export default interface Checklist {
  from: Date;
  to: Date;
  type: string;
  currentMeterReading?: number;
  workingHour?: number;
  items: ChecklistItem[];
}
