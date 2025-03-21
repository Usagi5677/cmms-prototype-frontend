import { Select } from "antd";
import React from "react";
import { DEPARTMENTS } from "../../helpers/constants";
import { DefaultStringArrayOptionProps } from "../../models/Enums";

export const DepartmentSelector: React.FC<DefaultStringArrayOptionProps> = ({
  onChange,
  rounded = false,
  multiple = false,
  width,
  value,
}) => {
  //no department master list from db yet

  let departmentOptions: any = [];
  DEPARTMENTS?.map((department: string) => {
    departmentOptions.push({
      value: department,
      label: department,
    });
  });

  return (
    <Select
      style={{ width: width ?? undefined }}
      showArrow
      placeholder="Select department"
      allowClear={true}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      mode={multiple ? "multiple" : undefined}
      options={departmentOptions}
      onChange={onChange}
      getPopupContainer={(trigger) => trigger.parentNode}
      defaultValue={value}
    />
  );
};
