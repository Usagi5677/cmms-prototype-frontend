import { Select } from "antd";
import React from "react";
import { ENGINE } from "../../helpers/constants";
import { DefaultStringArrayOptionProps } from "../../models/Enums";

export const EngineSelector: React.FC<DefaultStringArrayOptionProps> = ({
  onChange,
  rounded = false,
  multiple = false,
  width,
}) => {
  //no engine master list from db

  let engineOptions: any = [];
  ENGINE?.map((engine: string) => {
    engineOptions.push({
      value: engine,
      label: engine,
    });
  });

  return (
    <Select
      style={{ width: width ?? undefined }}
      showArrow
      placeholder="Select engine"
      allowClear={true}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      mode={multiple ? "multiple" : undefined}
      options={engineOptions}
      onChange={onChange}
      getPopupContainer={(trigger) => trigger.parentNode}
    />
  );
};
