import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { LOCATIONS } from "../../../api/queries";
import Location from "../../../models/Location";

export interface LocationSelectorProps {
  setLocationId?: any;
  currentId?: number | number[];
  rounded?: boolean;
  multiple?: boolean;
  width?: number | string;
  currentName?: string;
  placeholder?: string;
  onChange?: (locationId: number | number[], clear: any) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  setLocationId,
  currentId,
  rounded = false,
  multiple = false,
  width,
  currentName,
  placeholder = "Select location",
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

  const [getLocations, { data, loading }] = useLazyQuery(LOCATIONS, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getLocations({ variables: filter });
  }, [filter, getLocations]);

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
        if (setLocationId) setLocationId(val);
        setValue(val);
        if (onChange) onChange(val, clear);
      }}
      getPopupContainer={(trigger) => trigger.parentNode}
      value={value}
    >
      {data?.locations.edges.map((edge: { node: Location }) => (
        <Select.Option key={edge.node.id} value={edge.node.id}>
          {edge.node.name}
        </Select.Option>
      ))}
    </Select>
  );
};
