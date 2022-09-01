import ChecklistTemplateItem from "./ChecklistTemplateItem";

export default interface ChecklistTemplate {
  id: number;
  name: string;
  type: string;
  items: ChecklistTemplateItem[];
}
