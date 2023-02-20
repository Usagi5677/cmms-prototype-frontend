import { useMutation } from "@apollo/client";
import { Avatar, message, Popconfirm, Tag } from "antd";
import { REMOVE_USER_ROLE } from "../../../api/mutations";
import { ME_QUERY } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { RoleTagStringToColor, stringToColor } from "../../../helpers/style";
import User from "../../../models/User";
import classes from "./UserCard.module.css";
import { v1 } from "uuid";
import EditUserRoles from "../EditUserRoles/EditUserRoles";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import { hasPermissions } from "../../../helpers/permissions";

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
  return (
    <div className={classes["container"]}>
      <div className={classes["user"]}>
        <Avatar
          style={{
            backgroundColor: stringToColor(userData?.fullName ?? " "),
            marginRight: 10,
          }}
          size={"large"}
        >
          {userData?.fullName
            .match(/^\w|\b\w(?=\S+$)/g)
            ?.join()
            .replace(",", "")
            .toUpperCase()}
        </Avatar>
        <div>
          <div className={classes["title-wrapper"]}>
            <span>{userData.fullName}</span>{" "}
            <span className={classes["dot"]}>•</span>
            <span title={"RCNO"}>{userData.rcno}</span>
          </div>
          <div className={classes["tag-wrapper"]}>
            {userData.roles?.map((role) => (
              <Popconfirm
                disabled={
                  removingUserRole || !hasPermissions(self, ["EDIT_USER_ROLE"])
                }
                key={v1()}
                title={
                  <div>
                    Do you want to remove{" "}
                    <Tag
                      style={{
                        fontWeight: 800,
                        borderRadius: 2,
                        textAlign: "center",
                        maxWidth: 250,
                        backgroundColor: RoleTagStringToColor(role.role.name),
                        borderColor: RoleTagStringToColor(role.role.name),
                        borderWidth: 1,
                        cursor: hasPermissions(self, ["EDIT_USER_ROLE"])
                          ? "pointer"
                          : "initial",
                      }}
                    >
                      {role.role.name}
                    </Tag>
                    role from{" "}
                    <span style={{ fontWeight: 700 }}>{userData.fullName}</span>
                    ?
                  </div>
                }
                onConfirm={() => remove(role.role.id)}
                okText="Confirm"
                cancelText="No"
                placement="topRight"
              >
                <Tag
                  style={{
                    fontWeight: 700,
                    borderRadius: 2,
                    textAlign: "center",
                    maxWidth: 250,
                    backgroundColor: RoleTagStringToColor(role.role.name),
                    borderColor: RoleTagStringToColor(role.role.name),
                    borderWidth: 1,
                    cursor: hasPermissions(self, ["EDIT_USER_ROLE"])
                      ? "pointer"
                      : "initial",
                  }}
                  className={classes["tag"]}
                >
                  {role.role.name}
                </Tag>
              </Popconfirm>
            ))}
          </div>
          {/**{userData?.location?.name && (
            <div className={classes["sub-title"]}>
              <FaMapMarkerAlt style={{ marginRight: 5 }} />
              {userData?.location?.name}
            </div>
          )} */}
        </div>
      </div>
      <div className={classes["secondary"]}>
        <div className={classes["icon-wrapper"]}>
          <div className={classes["icon"]}>
            {hasPermissions(self, ["EDIT_USER_ROLE"]) ? (
              <EditUserRoles userData={userData} />
            ) : null}
          </div>
          {/*<div className={classes["icon"]}>
            {hasPermissions(self, ["EDIT_USER_LOCATION"]) ? (
              <EditUserLocation userData={userData} />
            ) : null}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
