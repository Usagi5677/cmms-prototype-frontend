import React from "react";
import { FaTractor, FaTruck } from "react-icons/fa";
import { RiSailboatFill } from "react-icons/ri";

export interface EntityIconProps {
  entityType?: string;
  size?: number;
}

export const EntityIcon: React.FC<EntityIconProps> = ({ entityType, size }) => {
  if (entityType === "Vehicle") {
    return <FaTruck style={{ fontSize: size ? size : "initial" }} />;
  } else if (entityType === "Vessel") {
    return <RiSailboatFill style={{ fontSize: size ? size : "initial" }} />;
  } else {
    return <FaTractor style={{ fontSize: size ? size : "initial" }} />;
  }
  return <div></div>;
};
