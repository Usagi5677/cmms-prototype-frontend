import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect, ChangeEvent } from "react";
import { ZONE } from "../../helpers/constants";
import { DefaultStringArrayOptionProps } from "../../models/Enums";

export const ZoneSelector: React.FC<DefaultStringArrayOptionProps> = ({
  onChange,
  rounded = false,
  multiple = false,
  width,
}) => {
  //no zone master list from db yet

  let zoneOptions: any = [];
  ZONE?.map((zone: string) => {
    zoneOptions.push({
      value: zone,
      label: zone,
    });
  });

  return (
    <Select
      style={{ width: width ?? undefined }}
      showArrow
      placeholder="Select zone"
      allowClear={true}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      mode={multiple ? "multiple" : undefined}
      options={zoneOptions}
      onChange={onChange}
      getPopupContainer={trigger => trigger.parentNode}
    />
  );
};
