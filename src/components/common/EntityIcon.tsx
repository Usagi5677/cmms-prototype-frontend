import React from "react";
import { FaTractor, FaTruck } from "react-icons/fa";
import { RiSailboatFill } from "react-icons/ri";

export interface EntityIconProps {
  entityType: string;
  transportationType?: string;
}

export const EntityIcon: React.FC<EntityIconProps> = ({
  entityType,
  transportationType,
}) => {
  if (entityType === "Machine") {
    return <FaTractor />;
  } else if (transportationType === "Vehicle") {
    return <FaTruck />;
  } else if (transportationType === "Vessel") {
    return <RiSailboatFill />;
  }
  return <div></div>;
};
