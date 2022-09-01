import { Select } from "antd";
import React from "react";
import { DefaultStringArrayOptionProps } from "../../models/Enums";

export const MeasurementSelector: React.FC<DefaultStringArrayOptionProps> = ({
  onChange,
  rounded = false,
  multiple = false,
  width,
}) => {
  return (
    <Select
      style={{ width: width ?? undefined }}
      showArrow
      placeholder="Select measurement"
      allowClear={true}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      mode={multiple ? "multiple" : undefined}
      onChange={onChange}
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      {["hr", "km", "days"].map((measurement: string) => (
        <Select.Option key={measurement} value={measurement}>
          {measurement}
        </Select.Option>
      ))}
    </Select>
  );
};
