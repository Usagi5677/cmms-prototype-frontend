import { Select } from "antd";
import { TransportationStatus } from "../../models/Enums";
import TransportationStatusTag from "./TransportationStatusTag";

const TransportationStatusFilter = ({
  onChange,
  value,
  margin,
}: {
  onChange?: (val: TransportationStatus) => void;
  value: TransportationStatus | null;
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
        {(Object.keys(TransportationStatus) as Array<keyof typeof TransportationStatus>).map(
          (status: any) => (
            <Select.Option key={status} value={status}>
              <TransportationStatusTag status={status} />
            </Select.Option>
          )
        )}
      </Select>
    </div>
  );
};

export default TransportationStatusFilter;
