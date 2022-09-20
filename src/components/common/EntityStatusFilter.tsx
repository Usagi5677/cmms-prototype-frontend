import { Select } from "antd";
import { useEffect, useState } from "react";
import { EntityStatus } from "../../models/Enums";
import EntityStatusTag from "./EntityStatusTag";

const EntityStatusFilter = ({
  onChange,
  value,
  margin,
  multiple,
  width,
}: {
  onChange?: (val: EntityStatus[]) => void;
  value: EntityStatus[] | null;
  margin?: string;
  multiple?: boolean;
  width?: number | string;
}) => {
  return (
    <div
      style={{
        display: "flex",
        margin,
        alignItems: "center",
      }}
    >
      <Select
        style={{ width: width ?? undefined }}
        showArrow
        placeholder="Filter status"
        onChange={onChange}
        allowClear={true}
        mode={multiple ? "multiple" : undefined}
        value={value}
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        {(Object.keys(EntityStatus) as Array<keyof typeof EntityStatus>).map(
          (status: any) => (
            <Select.Option key={status} value={status}>
              <EntityStatusTag status={status} />
            </Select.Option>
          )
        )}
      </Select>
    </div>
  );
};

export default EntityStatusFilter;
