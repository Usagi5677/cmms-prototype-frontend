import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { BRANDS } from "../../api/queries";
import Brand from "../../models/Brand";

export interface SearchBrandsProps {
  onChange: (brand: Brand) => void;
  allowClear?: any;
  onClear?: any;
  current?: Brand[];
  changing?: boolean;
  placeholder?: string;
  rounded?: boolean;
  width?: number;
  margin?: string;
}

export const SearchBrands: React.FC<SearchBrandsProps> = ({
  onChange,
  allowClear,
  onClear,
  current,
  changing,
  placeholder = "Select brand",
  rounded = false,
  width,
  margin,
}) => {
  const [selected, setSelected] = useState<null | number>(null);
  const [getAllBrands, { data: data, loading: searchLoading }] =
    useLazyQuery(BRANDS);

  useEffect(() => {
    if (selected) {
      const brand = data.brands.edges.find(
        (edge: { node: Brand }) => edge.node.id === selected
      ).node;
      if (brand) {
        onChange(brand);
        setSelected(null);
      }
    }
  }, [selected]);

  const fetchBrands = (value: string) => {
    if (value.length < 20) {
      getAllBrands({
        variables: {
          search: value,
          first: 10,
        },
      });
    }
  };

  const [timerId, setTimerId] = useState(null);

  const fetchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    //@ts-ignore
    setTimerId(setTimeout(() => fetchBrands(value), 500));
  };

  const filtered = data?.brands.edges
    .map((edge: { node: Brand }) => edge.node)
    .filter((loc: Brand) => {
      if (current) {
        for (const e of current) {
          if (e.id === loc.id) {
            return false;
          }
        }
      }
      return true;
    });

  return (
    <Select
      showSearch
      value={selected}
      placeholder={changing ? "Adding..." : placeholder}
      notFoundContent={searchLoading ? <Spin size="small" /> : null}
      loading={searchLoading}
      filterOption={false}
      onSearch={(value) => fetchDebounced(value)}
      onChange={setSelected}
      onClear={onClear}
      style={{ width: width ?? "100%", margin }}
      allowClear={allowClear ?? true}
      className={rounded ? undefined : "notRounded"}
    >
      {data
        ? filtered.map((loc: Brand) => (
            <Select.Option key={loc.id} value={loc.id}>
              {loc.name}
            </Select.Option>
          ))
        : null}
    </Select>
  );
};
