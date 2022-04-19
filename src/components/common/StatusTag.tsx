import { Tag } from "antd";
import { MachineStatus } from "../../models/Enums";

const StatusTag = ({ status }: { status: MachineStatus | undefined }) => {
  let color: string | undefined = undefined;
  if (status === "Working") color = "cyan";
  else if (status === "Pending") color = "orange";
  else if (status === "Breakdown") color = "red";
  return (
    <Tag color={color} style={{ fontWeight: 700, borderRadius: 20, textAlign:'center', maxWidth: 250 }}>
      {status}
    </Tag>
  );
};

export default StatusTag;
