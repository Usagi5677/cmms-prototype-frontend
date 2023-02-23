import EntityChecklistAndPMSummary from "../models/Entity/EntityChecklistAndPMSummary";

export function findIncompleteChecklistAndTasks(
  summaryData?: EntityChecklistAndPMSummary | undefined,
  id?: number | undefined,
) {
  let pm = false;
  let checklist = false;
  if (summaryData?.pm?.length! > 0) {
    for (const p of summaryData?.pm!) {
      if (p?.id === id) {
        pm = true;
      }
    }
  }
  if (summaryData?.checklist) {
    for (const ck of summaryData?.checklist!) {
      if (ck?.id === id) {
        checklist = true;
      }
    }
  }

  let result = [pm, checklist];
  return result;
}
