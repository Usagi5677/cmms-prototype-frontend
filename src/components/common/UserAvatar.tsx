import { Avatar } from "antd";
import { stringToColor } from "../../helpers/style";
import User from "../../models/User";

const UserAvatar = ({ user, size }: { user?: User | null; size?: number }) => {
  return (
    <Avatar
      style={{
        backgroundColor: stringToColor(user?.fullName ?? " "),
      }}
      size={size}
    >
      {user?.fullName
        .match(/^\w|\b\w(?=\S+$)/g)
        ?.join()
        .replace(",", "")
        .toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
