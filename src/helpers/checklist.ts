import Checklist from "../models/Checklist";
import ChecklistSummary from "../models/ChecklistSummary";

export function generateSummary(checklist: Checklist): ChecklistSummary {
  let summary: ChecklistSummary = JSON.parse(JSON.stringify(checklist));
  if (checklist.items.length === 0) {
    summary.itemCompletion = "empty";
  } else if (checklist.items.every((item) => item.completedAt !== null)) {
    summary.itemCompletion = "all";
  } else if (checklist.items.some((item) => item.completedAt !== null)) {
    summary.itemCompletion = "some";
  } else {
    summary.itemCompletion = "none";
  }
  summary.hasComments =
    checklist.comments.filter((c) => c.type === "Comment").length > 0
      ? true
      : false;
  summary.hasIssues =
    checklist.comments.filter((c) => c.type === "Issue").length > 0
      ? true
      : false;
  return summary;
}
