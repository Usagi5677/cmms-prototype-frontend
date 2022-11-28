import { Tag } from "antd";
import { EntityStatus } from "../../models/Enums";

const EntityStatusTag = ({
  status,
  noMarginRight,
  title
}: {
  status: EntityStatus | undefined;
  noMarginRight?: boolean;
  title?: string;
}) => {
  let color: string | undefined = undefined;
  if (status === "Working") color = "cyan";
  else if (status === "Critical") color = "orange";
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
        marginRight: noMarginRight ? 0 : 8,
      }}
      title={title}
    >
      {status}
    </Tag>
  );
};

export default EntityStatusTag;
