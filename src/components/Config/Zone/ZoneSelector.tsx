import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { ZONES } from "../../../api/queries";
import Zone from "../../../models/Zone";

export interface ZoneSelectorProps {
  setZoneId?: any;
  currentId?: number | number[];
  rounded?: boolean;
  multiple?: boolean;
  width?: number | string;
  currentName?: string;
  placeholder?: string;
  onChange?: (zoneId: number | number[], clear: any) => void;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  setZoneId,
  currentId,
  rounded = false,
  multiple = false,
  width,
  currentName,
  placeholder = "Select zone",
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<number[] | number | null>(
    multiple ? [] : null
  );
  const [firstLoad, setFirstLoad] = useState(true);
  const [filter, setFilter] = useState<{
    first: number;
    name: string;
  }>({
    first: 10,
    name: "",
  });

  const [getZones, { data, loading }] = useLazyQuery(ZONES);

  useEffect(() => {
    getZones({ variables: filter });
  }, [filter, getZones]);

  useEffect(() => {
    setFilter((filter) => ({
      ...filter,
      name: search,
    }));
  }, [search]);

  useEffect(() => {
    if (firstLoad) {
      if (currentId) {
        setValue(currentId);
      }
      if (currentName) {
        setSearch(currentName);
      }
      setFirstLoad(false);
    }
  }, [currentId, currentName, firstLoad]);

  const clear = () => {
    setValue(null);
  };

  return (
    <Select
      style={{ width: width ?? undefined }}
      showArrow
      placeholder={placeholder}
      allowClear={true}
      loading={loading}
      onSearch={setSearch}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      mode={multiple ? "multiple" : undefined}
      onChange={(val) => {
        if (setZoneId) setZoneId(val);
        setValue(val);
        if (onChange) onChange(val, clear);
      }}
      value={value}
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      {data?.zones.edges.map((edge: { node: Zone }) => (
        <Select.Option key={edge.node.id} value={edge.node.id}>
          {edge.node.name}
        </Select.Option>
      ))}
    </Select>
  );
};
