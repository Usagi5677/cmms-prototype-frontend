import { Tag } from "antd";
import { BreakdownStatus } from "../../models/Enums";

const BreakdownStatusTag = ({ status }: { status: BreakdownStatus | undefined }) => {
  let color: string | undefined = undefined;
  if (status === "Done") color = "cyan";
  else if (status === "Pending") color = "orange";
  else if (status === "Breakdown") color = "red";
  return (
    <Tag color={color} style={{ fontWeight: 700, borderRadius: 20, textAlign:'center', maxWidth: 250 }}>
      {status}
    </Tag>
  );
};

export default BreakdownStatusTag;
