import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { ENGINES } from "../../api/queries";
import Engine from "../../models/Engine";

export interface EngineSelectorProps {
  setEngineId: any;
  currentId?: number | number[];
  currentName?: string;
  rounded?: boolean;
  multiple?: boolean;
  width?: number | string;
}
export const EngineSelector: React.FC<EngineSelectorProps> = ({
  setEngineId,
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
  const [getEngines, { data, loading }] = useLazyQuery(ENGINES, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getEngines({ variables: filter });
  }, [filter]);

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
      placeholder="Select engine"
      allowClear={true}
      loading={loading}
      onSearch={setSearch}
      className={rounded ? undefined : "notRounded"}
      showSearch
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      mode={multiple ? "multiple" : undefined}
      onChange={(val) => {
        setEngineId(val);
        setValue(val);
      }}
      value={value}
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      {data?.engines.edges.map((edge: { node: Engine }) => (
        <Select.Option key={edge.node.id} value={edge.node.id}>
          {edge.node.name}
        </Select.Option>
      ))}
    </Select>
  );
};
