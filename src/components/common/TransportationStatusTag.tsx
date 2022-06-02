import { Tag } from "antd";
import { TransportationStatus } from "../../models/Enums";

const TransportationStatusTag = ({
  status,
}: {
  status: TransportationStatus | undefined;
}) => {
  let color: string | undefined = undefined;
  if (status === "Working") color = "cyan";
  else if (status === "Idle") color = "orange";
  else if (status === "Breakdown") color = "red";
  return (
    <Tag
      color={color}
      style={{
        fontWeight: 700,
        borderRadius: 20,
        textAlign: "center",
        maxWidth: 250,
      }}
    >
      {status}
    </Tag>
  );
};

export default TransportationStatusTag;
