import { Tag } from "antd";
import { EntityStatus } from "../../models/Enums";

const EntityStatusTag = ({
  status,
}: {
  status: EntityStatus | undefined;
}) => {
  let color: string | undefined = undefined;
  if (status === "Working") color = "cyan";
  else if (status === "Idle") color = "orange";
  else if (status === "Breakdown") color = "red";
  else if (status === "Dispose") color = "#8B0000";
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

export default EntityStatusTag;
