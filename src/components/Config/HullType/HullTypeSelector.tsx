import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { HULL_TYPES } from "../../../api/queries";
import HullType from "../../../models/HullType";

export interface HullTypeSelectorProps {
  setHullTypeId: any;
  currentId?: number | number[];
  currentName?: string;
  rounded?: boolean;
  multiple?: boolean;
  width?: number | string;
}

export const HullTypeSelector: React.FC<HullTypeSelectorProps> = ({
  setHullTypeId,
  currentId,
  currentName,
  rounded = false,
  multiple = false,
  width,
}) => {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<number[] | number | null>(
    multiple ? [] : null
  );
  const [filter, setFilter] = useState<{
    first: number;
    name: string;
  }>({
    first: 10,
    name: "",
  });
  const [firstLoad, setFirstLoad] = useState(true);
  const [getHullTypes, { data, loading }] = useLazyQuery(HULL_TYPES, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getHullTypes({ variables: filter });
  }, [filter, getHullTypes]);

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
      placeholder="Select hull type"
      allowClear={true}
      loading={loading}
      onSearch={setSearch}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      mode={multiple ? "multiple" : undefined}
      onChange={(val) => {
        setHullTypeId(val);
        setValue(val);
      }}
      value={value}
      getPopupContainer={trigger => trigger.parentNode}
    >
      {data?.hullTypes.edges.map((edge: { node: HullType }) => (
        <Select.Option key={edge.node.id} value={edge.node.id}>
          {edge.node.name}
        </Select.Option>
      ))}
    </Select>
  );
};
