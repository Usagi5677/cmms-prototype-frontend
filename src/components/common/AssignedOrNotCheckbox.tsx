import { useLazyQuery } from "@apollo/client";
import { Checkbox, Select, Spin } from "antd";
import React, { useState, useEffect, ChangeEvent } from "react";
import { BRAND, ENGINE, ZONE } from "../../helpers/constants";
import { DefaultBooleanOptionProps } from "../../models/Enums";

export const AssignedOrNotCheckbox: React.FC<DefaultBooleanOptionProps> = ({
  onChange,
  name,
}) => {
  //no engine master list from db
  return <Checkbox onChange={onChange}>{name}</Checkbox>;
};
