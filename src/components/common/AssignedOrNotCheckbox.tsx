import { Checkbox } from "antd";
import React from "react";
import { DefaultBooleanOptionProps } from "../../models/Enums";

export const AssignedOrNotCheckbox: React.FC<DefaultBooleanOptionProps> = ({
  onChange,
  name,
}) => {
  //no engine master list from db
  return <Checkbox onChange={onChange}>{name}</Checkbox>;
};
