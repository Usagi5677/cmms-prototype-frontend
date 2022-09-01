import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect, ChangeEvent } from "react";
import { BRAND, ZONE } from "../../helpers/constants";
import { DefaultStringArrayOptionProps } from "../../models/Enums";


export const BrandSelector: React.FC<DefaultStringArrayOptionProps> = ({
  onChange,
  rounded = false,
  multiple = false,
  width,
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
      getPopupContainer={trigger => trigger.parentNode}
    />
  );
};
