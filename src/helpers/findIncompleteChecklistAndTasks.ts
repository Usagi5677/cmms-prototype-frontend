import EntityChecklistAndPMSummary from "../models/Entity/EntityChecklistAndPMSummary";

export function findIncompleteChecklistAndTasks(
  summaryData?: EntityChecklistAndPMSummary | undefined,
  id?: number | undefined,
) {
  let pm = false;
  let checklist = false;
  if (summaryData?.pm) {
    for (const p of summaryData?.pm) {
      if (parseInt(p) === id) {
        pm = true;
      }
    }
  }
  if (summaryData?.checklist) {
    for (const ck of summaryData?.checklist) {
      if (parseInt(ck) === id) {
        checklist = true;
      }
    }
  }

  let result = [pm, checklist];
  return result;
}
