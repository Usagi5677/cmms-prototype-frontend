import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { LOCATIONS } from "../../../api/queries";
import Location from "../../../models/Location";

export interface LocationSelectorProps {
  setLocationId: any;
  currentId?: number;
  rounded?: boolean;
  multiple?: boolean;
  width?: number;
  currentName?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  setLocationId,
  currentId,
  rounded = false,
  multiple = false,
  width,
  currentName,
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

  return (
    <Select
      style={{ width: width ?? undefined }}
      showArrow
      placeholder="Select location"
      allowClear={true}
      loading={loading}
      onSearch={setSearch}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      mode={multiple ? "multiple" : undefined}
      onChange={(val) => {
        setLocationId(val);
        setValue(val);
      }}
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