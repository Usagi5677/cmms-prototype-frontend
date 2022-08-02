import { Select } from "antd";
import { ENTITY_TYPES } from "../../helpers/constants";

const EntityTypeFilter = ({
  onChange,
  value,
  margin,
}: {
  onChange?: (val: string) => void;
  value: string | null;
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
        style={{ minWidth: 179 }}
        placeholder="Filter entity type"
        onChange={onChange}
        allowClear={true}
        value={value}
      >
        {ENTITY_TYPES.map((type: string) => (
          <Select.Option key={type} value={type}>
            {type}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default EntityTypeFilter;
