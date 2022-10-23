import { Select } from "antd";
import { PeriodicMaintenanceStatus } from "../../models/Enums";
import PeriodicMaintenanceStatusTag from "./PeriodicMaintenanceStatusTag";

const PMStatusFilter = ({
  onChange,
  value,
  margin,
  multiple,
  width,
}: {
  onChange?: (val: PeriodicMaintenanceStatus[]) => void;
  value: PeriodicMaintenanceStatus[] | null;
  margin?: string;
  multiple?: boolean;
  width?: number | string;
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
        style={{ width: width ?? undefined }}
        showArrow
        placeholder="Filter status"
        onChange={onChange}
        allowClear={true}
        mode={multiple ? "multiple" : undefined}
        value={value}
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        {(
          Object.keys(PeriodicMaintenanceStatus) as Array<
            keyof typeof PeriodicMaintenanceStatus
          >
        ).map((status: any) => (
          <Select.Option key={status} value={status}>
            <PeriodicMaintenanceStatusTag status={status} />
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default PMStatusFilter;
