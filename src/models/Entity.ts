import Machine from "./Machine";
import Transportation from "./Transportation";

export default interface Entity {
  entityId: number;
  entityType: string;
  entityNo?: string;
  machine?: Machine;
  transportation?: Transportation;
  transportationType?: string;
}
