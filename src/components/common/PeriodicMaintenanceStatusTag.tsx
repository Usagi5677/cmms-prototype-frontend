import { Tag } from "antd";
import { PeriodicMaintenanceStatus } from "../../models/Enums";

const PeriodicMaintenanceStatusTag = ({
  status,
}: {
  status: PeriodicMaintenanceStatus | undefined;
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
        borderRadius: 20,
        textAlign: "center",
        maxWidth: 250,
      }}
    >
      {status}
    </Tag>
  );
};

export default PeriodicMaintenanceStatusTag;
