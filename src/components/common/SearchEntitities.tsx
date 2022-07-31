import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { SEARCH_ENTITY } from "../../api/queries";
import Entity from "../../models/Entity";
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
  const [selected, setSelected] = useState<null | string>(null);
  const [searchEntity, { data: data, loading: searchLoading }] =
    useLazyQuery(SEARCH_ENTITY);

  useEffect(() => {
    if (selected) {
      const entityId = parseInt(selected.split("_")[1]);
      const entityType = selected.split("_")[0];
      const entity = data.searchEntity.find(
        (x: Entity) => x.entityType === entityType && x.entityId === entityId
      );
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
        if (e.entityId === entity.entityId && e.entityType === e.entityType) {
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
            <Select.Option
              key={`${entity.entityType}_${entity.entityId}`}
              value={`${entity.entityType}_${entity.entityId}`}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <EntityIcon
                  entityType={entity.entityType}
                  transportationType={entity.transportationType}
                />
                <div style={{ marginLeft: ".5rem" }}>{entity.entityNo}</div>
              </div>
            </Select.Option>
          ))
        : null}
    </Select>
  );
};
