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
}

export const SearchEntities: React.FC<SearchEntitiesProps> = ({
  onChange,
  allowClear,
  onClear,
  current,
  changing,
}) => {
  const [selected, setSelected] = useState<null | number>(null);
  const [searchEntity, { data: data, loading: searchLoading }] =
    useLazyQuery(SEARCH_ENTITY);

  useEffect(() => {
    if (selected) {
      const entity = data.searchEntity.find((x: Entity) => x.id === selected);
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
      placeholder={changing ? "Adding..." : "Select machinery or transport"}
      notFoundContent={searchLoading ? <Spin size="small" /> : null}
      loading={searchLoading}
      filterOption={false}
      onSearch={(value) => fetchDebounced(value)}
      onChange={setSelected}
      onClear={onClear}
      style={{ width: "100%" }}
      allowClear={allowClear ?? true}
      className="notRounded"
    >
      {data
        ? filtered.map((entity: Entity) => (
            <Select.Option key={entity.id} value={entity.id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <EntityIcon entityType={entity.type?.entityType} />
                <div style={{ marginLeft: ".5rem" }}>
                  {entity.machineNumber}
                </div>
              </div>
            </Select.Option>
          ))
        : null}
    </Select>
  );
};
