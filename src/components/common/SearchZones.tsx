import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { SEARCH_ZONES } from "../../api/queries";
import Zone from "../../models/Zone";

export interface SearchZonesProps {
  onChange: (zone: Zone) => void;
  allowClear?: any;
  onClear?: any;
  current?: Zone[];
  changing?: boolean;
  placeholder?: string;
  rounded?: boolean;
  width?: number;
  margin?: string;
}

export const SearchZones: React.FC<SearchZonesProps> = ({
  onChange,
  allowClear,
  onClear,
  current,
  changing,
  placeholder = "Select zone",
  rounded = false,
  width,
  margin,
}) => {
  const [selected, setSelected] = useState<null | number>(null);
  const [searchZone, { data: data, loading: searchLoading }] =
    useLazyQuery(SEARCH_ZONES);

  useEffect(() => {
    if (selected) {
      const zone = data.searchZone.find(
        (x: Zone) => x.id === selected
      );
      if (zone) {
        onChange(zone);
        setSelected(null);
      }
    }
  }, [selected]);

  const fetchZone = (value: string) => {
    if (value.length < 20) {
      searchZone({
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
    setTimerId(setTimeout(() => fetchZone(value), 500));
  };

  const filtered = data?.searchZone.filter((zone: Zone) => {
    if (current) {
      for (const e of current) {
        if (e.id === zone.id) {
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
        ? filtered.map((z: Zone) => (
            <Select.Option key={z.id} value={z.id}>
              {z.name}
            </Select.Option>
          ))
        : null}
    </Select>
  );
};
