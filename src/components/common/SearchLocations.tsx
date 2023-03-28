import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { SEARCH_LOCATION } from "../../api/queries";
import Location from "../../models/Location";

export interface SearchLocationsProps {
  onChange: (location: Location) => void;
  allowClear?: any;
  onClear?: any;
  current?: Location[];
  changing?: boolean;
  placeholder?: string;
  rounded?: boolean;
  width?: number;
  margin?: string;
}

export const SearchLocations: React.FC<SearchLocationsProps> = ({
  onChange,
  allowClear,
  onClear,
  current,
  changing,
  placeholder = "Select location",
  rounded = false,
  width,
  margin,
}) => {
  const [selected, setSelected] = useState<null | number>(null);
  const [searchLocation, { data: data, loading: searchLoading }] =
    useLazyQuery(SEARCH_LOCATION);

  useEffect(() => {
    if (selected) {
      const location = data.searchLocation.find(
        (x: Location) => x.id === selected
      );
      if (location) {
        onChange(location);
        setSelected(null);
      }
    }
  }, [selected]);

  const fetchLocation = (value: string) => {
    if (value.length < 20) {
      searchLocation({
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
    setTimerId(setTimeout(() => fetchLocation(value), 500));
  };

  const filtered = data?.searchLocation.filter((location: Location) => {
    if (current) {
      for (const e of current) {
        if (e.id === location.id) {
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
        ? filtered.map((loc: Location) => (
            <Select.Option key={loc.id} value={loc.id}>
              {loc.name}
            </Select.Option>
          ))
        : null}
    </Select>
  );
};
