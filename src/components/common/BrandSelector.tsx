import { Select } from "antd";
import React from "react";
import { BRAND } from "../../helpers/constants";
import { DefaultStringArrayOptionProps } from "../../models/Enums";

export const BrandSelector: React.FC<DefaultStringArrayOptionProps> = ({
  onChange,
  rounded = false,
  multiple = false,
  width,
  value,
}) => {
  //no brand master list from db yet

  let brandOptions: any = [];
  BRAND?.map((brand: string) => {
    brandOptions.push({
      value: brand,
      label: brand,
    });
  });

  return (
    <Select
      style={{ width: width ?? undefined }}
      showArrow
      placeholder="Select brand"
      allowClear={true}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      mode={multiple ? "multiple" : undefined}
      options={brandOptions}
      onChange={onChange}
      getPopupContainer={(trigger) => trigger.parentNode}
      defaultValue={value}
    />
  );
};
