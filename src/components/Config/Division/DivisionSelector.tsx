import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { DIVISIONS } from "../../../api/queries";
import Division from "../../../models/Division";



export interface DivisionSelectorProps {
  setDivisionId?: any;
  currentId?: number | number[];
  rounded?: boolean;
  multiple?: boolean;
  width?: number | string;
  currentName?: string;
  placeholder?: string;
  onChange?: (divisionId: number | number[], clear: any) => void;
}

export const DivisionSelector: React.FC<DivisionSelectorProps> = ({
  setDivisionId,
  currentId,
  rounded = false,
  multiple = false,
  width,
  currentName,
  placeholder = "Select division",
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

  const [getDivisions, { data, loading }] = useLazyQuery(DIVISIONS, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getDivisions({ variables: filter });
  }, [filter, getDivisions]);

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
      //if (currentName) {
      //  setSearch(currentName);
      //}
      getDivisions({ variables: {first: 10, name: ""} });
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
        if (setDivisionId) setDivisionId(val);
        setValue(val);
        if (onChange) onChange(val, clear);
      }}
      getPopupContainer={(trigger) => trigger.parentNode}
      value={value}
    >
      {data?.divisions.edges.map((edge: { node: Division }) => (
        <Select.Option key={edge.node.id} value={edge.node.id}>
          {edge.node.name}
        </Select.Option>
      ))}
    </Select>
  );
};
