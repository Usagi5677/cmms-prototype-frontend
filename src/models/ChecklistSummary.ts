import Checklist from "./Checklist";

export default interface ChecklistSummary extends Checklist {
  itemCompletion?: "all" | "some" | "none" | "empty";
  hasComments?: boolean;
  hasIssues?: boolean;
}
