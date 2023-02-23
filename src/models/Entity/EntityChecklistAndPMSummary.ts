interface machineDetail {
  id: number;
  machineNumber: string;
}
export default interface EntityChecklistAndPMSummary {
  pm?: machineDetail[];
  checklist?: machineDetail[];
}
