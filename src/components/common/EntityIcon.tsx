import React from "react";
import { FaTractor, FaTruck } from "react-icons/fa";
import { RiSailboatFill } from "react-icons/ri";

export interface EntityIconProps {
  entityType?: string;
}

export const EntityIcon: React.FC<EntityIconProps> = ({ entityType }) => {
  if (entityType === "Vehicle") {
    return <FaTruck />;
  } else if (entityType === "Vessel") {
    return <RiSailboatFill />;
  } else {
    return <FaTractor />;
  }
  return <div></div>;
};
