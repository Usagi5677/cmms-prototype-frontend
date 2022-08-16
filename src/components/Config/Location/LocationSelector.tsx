import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { LOCATIONS } from "../../../api/queries";
import Location from "../../../models/Location";

export interface LocationSelectorProps {
  setLocationId: React.Dispatch<React.SetStateAction<number | null>>;
  currentId?: number;
  rounded?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  setLocationId,
  currentId,
  rounded = false,
}) => {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(currentId ?? null);
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

  return (
    <Select
      showArrow
      placeholder="Select location"
      allowClear={true}
      loading={loading}
      onSearch={setSearch}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
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
