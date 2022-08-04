import { Select } from "antd";
import { EntityStatus } from "../../models/Enums";
import EntityStatusTag from "./EntityStatusTag";

const EntityStatusFilter = ({
  onChange,
  value,
  margin,
}: {
  onChange?: (val: EntityStatus) => void;
  value: EntityStatus | null;
  margin?: string;
}) => {
  return (
    <div
      style={{
        display: "flex",
        padding: "1px 5px 1px 5px",
        margin,
        alignItems: "center",
      }}
    >
      <Select
        showArrow
        style={{ minWidth: 130 }}
        placeholder="Filter status"
        onChange={onChange}
        allowClear={true}
        value={value}
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
