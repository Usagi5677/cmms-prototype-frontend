import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { SEARCH_DIVISION } from "../../api/queries";
import Division from "../../models/Division";

export interface SearchDivisionsProps {
  onChange: (division: Division) => void;
  allowClear?: any;
  onClear?: any;
  current?: Division[];
  changing?: boolean;
  placeholder?: string;
  rounded?: boolean;
  width?: number;
  margin?: string;
}

export const SearchDivisions: React.FC<SearchDivisionsProps> = ({
  onChange,
  allowClear,
  onClear,
  current,
  changing,
  placeholder = "Select division",
  rounded = false,
  width,
  margin,
}) => {
  const [selected, setSelected] = useState<null | number>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [searchDivision, { data: data, loading: searchLoading }] =
    useLazyQuery(SEARCH_DIVISION);

  useEffect(() => {
    if (selected) {
      const division = data.searchDivision.find((x: Division) => x.id === selected);
      if (division) {
        onChange(division);
        setSelected(null);
      }
    }
  }, [selected]);

  const fetchDivision = (value: string) => {
    if (value.length < 20) {
      searchDivision({
        variables: {
          query: value,
        },
      });
    }
  };

  const [timerId, setTimerId] = useState(null);

  const fetchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    //@ts-ignore
    setTimerId(setTimeout(() => fetchDivision(value), 500));
  };

  useEffect(() => {
    if (firstLoad) {
      fetchDivision("");
      setFirstLoad(false);
    }
  }, []);

  const filtered = data?.searchDivision.filter((division: Division) => {
    if (current) {
      for (const e of current) {
        if (e.id === division.id) {
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
        ? filtered.map((division: Division) => (
            <Select.Option key={division.id} value={division.id}>
              {division?.name}
            </Select.Option>
          ))
        : null}
    </Select>
  );
};
