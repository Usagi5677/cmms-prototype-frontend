import { Select } from "antd";
import { MachineStatus } from "../../models/Enums";
import MachineStatusTag from "./MachineStatusTag";

const MachineStatusFilter = ({
  onChange,
  value,
  margin,
}: {
  onChange?: (val: MachineStatus) => void;
  value: MachineStatus | null;
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
        {(Object.keys(MachineStatus) as Array<keyof typeof MachineStatus>).map(
          (status: any) => (
            <Select.Option key={status} value={status}>
              <MachineStatusTag status={status} />
            </Select.Option>
          )
        )}
      </Select>
    </div>
  );
};

export default MachineStatusFilter;
