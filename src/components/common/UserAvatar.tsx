import { Avatar, Tooltip } from "antd";
import { stringToColor } from "../../helpers/style";
import User from "../../models/User";

const UserAvatar = ({
  user,
  size,
  withTooltip,
}: {
  user?: User | null;
  size?: number;
  withTooltip?: string;
}) => {
  if (withTooltip) {
    return (
      <Tooltip title={withTooltip}>
        <Avatar
          style={{
            backgroundColor: stringToColor(user?.fullName ?? " "),
          }}
          size={size ? size : "default"}
        >
          {user?.fullName
            .match(/^\w|\b\w(?=\S+$)/g)
            ?.join()
            .replace(",", "")
            .toUpperCase()}
        </Avatar>
      </Tooltip>
    );
  } else {
    return (
      <Avatar
        style={{
          backgroundColor: stringToColor(user?.fullName ?? " "),
        }}
        size={size ? size : "default"}
      >
        {user?.fullName
          .match(/^\w|\b\w(?=\S+$)/g)
          ?.join()
          .replace(",", "")
          .toUpperCase()}
      </Avatar>
    );
  }
};

export default UserAvatar;
