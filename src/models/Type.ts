import InterServiceColor from "./InterServiceColor";

export default interface Type {
  id: number;
  name: string;
  entityType: "Machine" | "Vessel" | "Vehicle" | "Sub Entity";
  interServiceColor?: InterServiceColor[];
}
