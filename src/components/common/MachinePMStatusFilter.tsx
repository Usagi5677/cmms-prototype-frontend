import { Select } from "antd";
import { PeriodicMaintenanceStatus } from "../../models/Enums";
import PeriodicMaintenanceStatusTag from "./PeriodicMaintenanceStatusTag";

const MachinePMStatusFilter = ({
  onChange,
  value,
  margin,
}: {
  onChange?: (val: PeriodicMaintenanceStatus) => void;
  value: PeriodicMaintenanceStatus | null;
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
     
        placeholder="Filter status"
        onChange={onChange}
        allowClear={true}
        value={value}
      >
        {(Object.keys(PeriodicMaintenanceStatus) as Array<keyof typeof PeriodicMaintenanceStatus>).map(
          (status: any) => (
            <Select.Option key={status} value={status}>
              <PeriodicMaintenanceStatusTag status={status} />
            </Select.Option>
          )
        )}
      </Select>
    </div>
  );
};

export default MachinePMStatusFilter;
