import { BreakdownStatus } from "../Enums";
import User from "../User";

export default interface EntityChecklistAndPMSummary {
  pm?: string[];
  checklist?: string[];
  machineTaskComplete?: boolean;
  machineChecklistComplete?: boolean;
  vehicleTaskComplete?: boolean;
  vehicleChecklistComplete?: boolean;
  vesselTaskComplete?: boolean;
  vesselChecklistComplete?: boolean;
}
