import { Tag } from "antd";
import { MachineStatus } from "../../models/Enums";

const MachineStatusTag = ({ status }: { status: MachineStatus | undefined }) => {
  let color: string | undefined = undefined;
  if (status === "Working") color = "cyan";
  else if (status === "Idle") color = "orange";
  else if (status === "Breakdown") color = "red";
  else if (status === "Dispose") color = "red";
  return (
    <Tag color={color} style={{ fontWeight: 700, borderRadius: 20, textAlign:'center', maxWidth: 250 }}>
      {status}
    </Tag>
  );
};

export default MachineStatusTag;
