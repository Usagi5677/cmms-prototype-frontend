import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { ALL_ENTITY } from "../../api/queries";
import { Entity } from "../../models/Entity/Entity";

export interface EntitySelectorProps {
  setEntityId?: any;
  currentId?: number | number[];
  currentName?: string;
  rounded?: boolean;
  multiple?: boolean;
  width?: number | string;
  placeholder?: string;
  onChange?: (entityId: number | number[], clear: any) => void;
}

export const EntitySelector: React.FC<EntitySelectorProps> = ({
  setEntityId,
  currentId,
  currentName,
  rounded = false,
  multiple = false,
  width,
  placeholder = "Select Entity",
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<number[] | number | null>(
    multiple ? [] : null
  );
  const [filter, setFilter] = useState<{
    first: number;
    search: string;
  }>({
    first: 10,
    search: "",
  });
  const [firstLoad, setFirstLoad] = useState(true);
  const [getEntities, { data, loading }] = useLazyQuery(ALL_ENTITY, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getEntities({ variables: filter });
  }, [filter, getEntities]);

  useEffect(() => {
    setFilter((filter) => ({
      ...filter,
      search: search,
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
        if (setEntityId) setEntityId(val);
        setValue(val);
        if (onChange) onChange(val, clear);
      }}
      value={value}
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      {data?.getAllEntity.edges.map((edge: { node: Entity }) => (
        <Select.Option key={edge.node.id} value={edge.node.id}>
          {edge.node.machineNumber}
        </Select.Option>
      ))}
    </Select>
  );
};
