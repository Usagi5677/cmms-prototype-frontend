import { Select } from "antd";

const ChecklistTemplateTypeFilter = ({
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
        placeholder="Filter type"
        onChange={onChange}
        allowClear={true}
        value={value}
      >
        {["Daily", "Weekly"].map((type: string) => (
          <Select.Option key={type} value={type}>
            {type}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default ChecklistTemplateTypeFilter;
