import { Select } from "antd";
import { ENTITY_ASSIGNMENT_TYPES } from "../../helpers/constants";

const AssignmentTypeSelector = ({
  onChange,
  value,
  margin,
  width,
  rounded = true,
}: {
  onChange?: (val: string | null) => void;
  value: string | null;
  margin?: string;
  width?: number | string;
  rounded?: boolean;
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
        placeholder="Filter assignment type"
        onChange={onChange}
        allowClear={true}
        value={value}
        getPopupContainer={(trigger) => trigger.parentNode}
        className={rounded ? undefined : "notRounded"}
      >
        {ENTITY_ASSIGNMENT_TYPES.map((type: any) => (
          <Select.Option key={type} value={type}>
            {type}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default AssignmentTypeSelector;
