import { Select } from "antd";
import React from "react";
import { ENTITY_TYPES } from "../../helpers/constants";
import { DefaultStringArrayOptionProps } from "../../models/Enums";

export const EntityTypeSelector: React.FC<DefaultStringArrayOptionProps> = ({
  onChange,
  rounded = false,
  multiple = false,
  width,
  value,
}) => {
  let entityTypeOptions: any = [];
  ENTITY_TYPES?.map((entityType: string) => {
    entityTypeOptions.push({
      value: entityType,
      label: entityType,
    });
  });

  return (
    <Select
      style={{ width: width ?? undefined }}
      showArrow
      placeholder="Select entity type"
      allowClear={true}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      mode={multiple ? "multiple" : undefined}
      options={entityTypeOptions}
      onChange={onChange}
      getPopupContainer={(trigger) => trigger.parentNode}
      defaultValue={value}
    />
  );
};
