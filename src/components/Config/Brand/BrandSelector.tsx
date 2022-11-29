import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { BRANDS } from "../../../api/queries";
import Brand from "../../../models/Brand";

export interface BrandSelectorProps {
  setBrandId?: any;
  currentId?: number | number[];
  rounded?: boolean;
  multiple?: boolean;
  width?: number | string;
  currentName?: string;
  placeholder?: string;
  onChange?: (locationId: number | number[], clear: any) => void;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({
  setBrandId,
  currentId,
  rounded = false,
  multiple = false,
  width,
  currentName,
  placeholder = "Select brand",
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

  const [getBrands, { data, loading }] = useLazyQuery(BRANDS, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getBrands({ variables: filter });
  }, [filter, getBrands]);

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
        if (setBrandId) setBrandId(val);
        setValue(val);
        if (onChange) onChange(val, clear);
      }}
      getPopupContainer={(trigger) => trigger.parentNode}
      value={value}
    >
      {data?.brands.edges.map((edge: { node: Brand }) => (
        <Select.Option key={edge.node.id} value={edge.node.id}>
          {edge.node.name}
        </Select.Option>
      ))}
    </Select>
  );
};
