import { FaMapMarkerAlt } from "react-icons/fa";
import ValueCard from "../../../common/ValueCard/ValueCard";
import classes from "./ValueCardContainer.module.css";
const ValueCardContainer = () => {
  return <div className={classes["container"]}>
    <ValueCard name={"Location"} amount={123} icon={FaMapMarkerAlt} />
    <ValueCard name={"Location"} amount={123} icon={FaMapMarkerAlt} />
    <ValueCard name={"Location"} amount={123} icon={FaMapMarkerAlt} />
    <ValueCard name={"Location"} amount={123} icon={FaMapMarkerAlt} />
    <ValueCard name={"Location"} amount={123} icon={FaMapMarkerAlt} />
    <ValueCard name={"Location"} amount={123} icon={FaMapMarkerAlt} />
  </div>;
};

export default ValueCardContainer;
