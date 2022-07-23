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
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import EditUserLocation from "../EditUserLocation/EditUserLocation";

const UserCard = ({ userData }: { userData: User }) => {
  const { user: self } = useContext(UserContext);

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

  console.log(userData);
  return (
    <div className={classes["container"]}>
      <div className={classes["user"]}>
        <UserAvatar user={userData} size={30} />
        <div className={classes["user-fullname"]}>
          {userData.fullName} ({userData.rcno})
        </div>
      </div>
      <div className={classes["secondary"]}>
        <div className={classes["tag"]}>
          {userData.roles?.map((role) => (
            <Popconfirm
              disabled={
                removingUserRole || !self.assignedPermission.hasEditUserRole
              }
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
                  cursor: self.assignedPermission.hasEditUserRole
                    ? "pointer"
                    : "initial",
                }}
              >
                {role.role.name}
              </Tag>
            </Popconfirm>
          ))}
        </div>
        <div className={classes["icon-wrapper"]}>
          {self.assignedPermission.hasEditUserRole ? (
            <EditUserRoles userData={userData} />
          ) : null}
        </div>
        <div className={classes["icon-wrapper"]}>
          {self.assignedPermission.hasEditUserLocation ? (
            <EditUserLocation userData={userData} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
