import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { SEARCH_ENTITY } from "../../api/queries";
import { Entity } from "../../models/Entity/Entity";
import { EntityIcon } from "./EntityIcon";

export interface SearchEntitiesProps {
  onChange: (entity: Entity) => void;
  allowClear?: any;
  onClear?: any;
  current?: Entity[];
  changing?: boolean;
  placeholder?: string;
  rounded?: boolean;
  width?: number;
  margin?: string;
}

export const SearchEntities: React.FC<SearchEntitiesProps> = ({
  onChange,
  allowClear,
  onClear,
  current,
  changing,
  placeholder = "Select machinery or transport",
  rounded = false,
  width,
  margin,
}) => {
  const [selected, setSelected] = useState<null | number>(null);
  const [searchEntity, { data: data, loading: searchLoading }] =
    useLazyQuery(SEARCH_ENTITY);

  useEffect(() => {
    if (selected) {
      const entity = data.searchEntity.find((x: Entity) => x.id === selected);
      console.log(entity)
      if (entity) {
        onChange(entity);
        setSelected(null);
      }
    }
  }, [selected]);

  const fetchEntity = (value: string) => {
    if (value.length < 20) {
      searchEntity({
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
    setTimerId(setTimeout(() => fetchEntity(value), 500));
  };

  const filtered = data?.searchEntity.filter((entity: Entity) => {
    if (current) {
      for (const e of current) {
        if (e.id === entity.id) {
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
        ? filtered.map((entity: Entity) => (
            <Select.Option key={entity.id} value={entity.id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <EntityIcon entityType={entity.type?.entityType} />
                <div style={{ marginLeft: ".5rem" }}>
                  {entity.machineNumber}
                </div>
                <div
                  style={{ marginLeft: ".5rem", fontSize: "80%", opacity: 0.7 }}
                >
                  {entity.location?.name}
                </div>
              </div>
            </Select.Option>
          ))
        : null}
    </Select>
  );
};
