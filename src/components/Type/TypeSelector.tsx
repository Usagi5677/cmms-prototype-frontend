import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { TYPES } from "../../api/queries";
import Type from "../../models/Type";

export interface TypeSelectorProps {
  entityType?: "Machine" | "Vehicle" | "Vessel";
  setTypeId: React.Dispatch<React.SetStateAction<number | null>>;
  currentId?: number;
  rounded?: boolean;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  entityType,
  setTypeId,
  currentId,
  rounded = false,
}) => {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(currentId ?? null);
  const [filter, setFilter] = useState<{
    first: number;
    name: string;
    entityType: string;
  }>({
    first: 10,
    name: "",
    entityType: "",
  });

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
    }
  }, [search, entityType]);

  return (
    <Select
      showArrow
      placeholder="Select type"
      allowClear={true}
      loading={loading}
      onSearch={setSearch}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      onChange={(val) => {
        setTypeId(val);
        setValue(val);
      }}
      value={value}
    >
      {data?.types.edges.map((edge: { node: Type }) => (
        <Select.Option key={edge.node.id} value={edge.node.id}>
          {edge.node.name}
        </Select.Option>
      ))}
    </Select>
  );
};
