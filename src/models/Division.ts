import DivisionAssign from "./DivisionAssign";

export default interface Division {
  id: number;
  name: string;
  assignees?: DivisionAssign[];
}
