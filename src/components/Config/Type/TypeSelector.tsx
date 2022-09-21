import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { TYPES } from "../../../api/queries";
import Type from "../../../models/Type";

export interface TypeSelectorProps {
  entityType?: "Machine" | "Vehicle" | "Vessel";
  setTypeId: any;
  currentId?: number | number[];
  currentName?: string;
  rounded?: boolean;
  multiple?: boolean;
  width?: number | string;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  entityType,
  setTypeId,
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
    entityType: string;
  }>({
    first: 10,
    name: "",
    entityType: "",
  });
  const [firstLoad, setFirstLoad] = useState(true);
  const [getTypes, { data, loading }] = useLazyQuery(TYPES, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getTypes({ variables: filter });
  }, [filter, getTypes]);

  useEffect(() => {
    if (entityType) {
      setFilter((filter) => ({
        ...filter,
        entityType: entityType,
        name: search,
      }));
    } else {
      setFilter((filter) => ({
        ...filter,
        entityType: entityType!,
        name: search,
      }));
    }
  }, [search, entityType]);

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
      placeholder="Select type"
      allowClear={true}
      loading={loading}
      onSearch={setSearch}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      mode={multiple ? "multiple" : undefined}
      onChange={(val) => {
        setTypeId(val);
        setValue(val);
      }}
      value={value}
      getPopupContainer={trigger => trigger.parentNode}
    >
      {data?.types.edges.map((edge: { node: Type }) => (
        <Select.Option key={edge.node.id} value={edge.node.id}>
          {edge.node.name}
        </Select.Option>
      ))}
    </Select>
  );
};
