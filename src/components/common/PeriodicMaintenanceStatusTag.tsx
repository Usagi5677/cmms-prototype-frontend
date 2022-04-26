import { Tag } from "antd";
import { PeriodicMaintenanceStatus } from "../../models/Enums";

const ScheduleMaintenanceStatusTag = ({ status }: { status: PeriodicMaintenanceStatus | undefined }) => {
  let color: string | undefined = undefined;
  if (status === "Done") color = "cyan";
  else if (status === "Pending") color = "orange";
  else if (status === "Missed") color = "red";
  return (
    <Tag color={color} style={{ fontWeight: 700, borderRadius: 20, textAlign:'center', maxWidth: 250 }}>
      {status}
    </Tag>
  );
};

export default ScheduleMaintenanceStatusTag;
