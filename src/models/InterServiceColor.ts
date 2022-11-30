import Brand from "./Brand";
import Type from "./Type";

export default interface InterServiceColor {
  id: number;
  measurement: string;
  greaterThan: number;
  lessThan: number;
  type?: Type;
  brand?: Brand;
}
