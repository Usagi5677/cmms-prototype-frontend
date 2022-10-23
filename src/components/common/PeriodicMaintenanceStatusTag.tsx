import { Tag } from "antd";
import { PeriodicMaintenanceStatus } from "../../models/Enums";

const PeriodicMaintenanceStatusTag = ({
  status,
  height,
  fontSize,
  borderRadius,
  marginBottom,
}: {
  status: PeriodicMaintenanceStatus | undefined;
  height?: number;
  fontSize?: number;
  borderRadius?: number;
  marginBottom?: number;
}) => {
  let color: string | undefined = undefined;
  if (status === "Completed") color = "cyan";
  else if (status === "Ongoing" || status === "Upcoming") color = "orange";
  else if (status === "Overdue") color = "red";
  return (
    <Tag
      color={color}
      style={{
        fontWeight: 700,
        borderRadius: borderRadius ? borderRadius : 20,
        maxWidth: 250,
        width: "fit-content",
        fontSize: fontSize ? fontSize : "inherit",
        height: height ? height : "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: marginBottom ? marginBottom : 0,
      }}
    >
      {status}
    </Tag>
  );
};

export default PeriodicMaintenanceStatusTag;
