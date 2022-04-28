import { Tag } from "antd";
import { RepairStatus } from "../../models/Enums";

const RepairStatusTag = ({ status }: { status: RepairStatus | undefined }) => {
  let color: string | undefined = undefined;
  if (status === "Done") color = "cyan";
  else if (status === "Pending") color = "orange";
  return (
    <Tag color={color} style={{ fontWeight: 700, borderRadius: 20, textAlign:'center', maxWidth: 250 }}>
      {status}
    </Tag>
  );
};

export default RepairStatusTag;
