import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tag } from "antd";
import { REMOVE_USER_ROLE } from "../../../api/mutations";
import { ME_QUERY } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { RoleTagStringToColor } from "../../../helpers/style";
import User from "../../../models/User";
import UserAvatar from "../../common/UserAvatar";
import classes from "./UserCard.module.css";
import { v1 } from "uuid";
import EditUserRoles from "../EditUserRoles/EditUserRoles";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import { findPermission } from "../../../helpers/findPermission";

const UserCard = ({ userData }: { userData: User }) => {
  const { user: self } = useContext(UserContext);
  const [permissionExist, setPermissionExist] = useState(false);

  const [removeUserRole, { loading: removingUserRole }] = useMutation(
    REMOVE_USER_ROLE,
    {
      onCompleted: () => {
        message.success("Successfully removed user role.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while removing app user.");
      },
      refetchQueries: ["getAllUsers", { query: ME_QUERY }],
    }
  );
  const remove = (roleId: number) => {
    removeUserRole({
      variables: {
        userId: userData.id,
        roleId,
      },
    });
  };

  useEffect(() => {
    setPermissionExist(findPermission(self, "DELETE_ROLE"));
  }, []);

  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div className={classes["user"]}>
            <UserAvatar user={userData} />
            <div className={classes["user-fullname"]}>
              {userData.fullName} ({userData.rcno})
            </div>
          </div>
        </div>
        <div className={classes["icon-wrapper"]}>
          <EditUserRoles userData={userData} />
        </div>
        <div className={classes["status"]}>
          {userData.roles?.map((role) => (
            <Popconfirm
              disabled={removingUserRole || !permissionExist}
              key={v1()}
              title={`Do you want to remove ${role.role.name} role from ${userData.fullName}?`}
              onConfirm={() => remove(role.role.id)}
              okText="Confirm"
              cancelText="No"
              placement="topRight"
            >
              <Tag
                style={{
                  fontWeight: 700,
                  borderRadius: 20,
                  textAlign: "center",
                  maxWidth: 250,
                  backgroundColor: RoleTagStringToColor(role.role.name),
                  borderColor: RoleTagStringToColor(role.role.name),
                  borderWidth: 1,
                  cursor: permissionExist ? "pointer" : "initial",
                }}
              >
                {role.role.name}
              </Tag>
            </Popconfirm>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
