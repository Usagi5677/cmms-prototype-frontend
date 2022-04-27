import { Tag } from "antd";
import { SparePRStatus } from "../../models/Enums";

const SparePRStatusTag = ({ status }: { status: SparePRStatus | undefined }) => {
  let color: string | undefined = undefined;
  if (status === "Done") color = "cyan";
  else if (status === "Pending") color = "orange";
  return (
    <Tag color={color} style={{ fontWeight: 700, borderRadius: 20, textAlign:'center', maxWidth: 250 }}>
      {status}
    </Tag>
  );
};

export default SparePRStatusTag;
