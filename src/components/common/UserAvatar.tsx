import { Avatar } from "antd";
import User from "../models/User";

const UserAvatar = ({ user }: { user?: User | null }) => {
  return (
    <Avatar
      // style={{
      //   backgroundColor: stringToColor(user?.fullName ?? " "),
      // }}
    >
      {/* {user?.fullName
        .match(/^\w|\b\w(?=\S+$)/g)
        ?.join()
        .replace(",", "")
        .toUpperCase()} */}
    </Avatar>
  );
};

export default UserAvatar;