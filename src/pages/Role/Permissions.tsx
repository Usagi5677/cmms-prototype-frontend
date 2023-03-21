import { LeftOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Divider, Switch, Tag, Typography } from "antd";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { TOGGLE_PERMISSION } from "../../api/mutations";
import {
  GET_ALL_PERMISSIONS,
  GET_ROLE_WITH_PERMISSION,
} from "../../api/queries";
import { CenteredSpin } from "../../components/common/CenteredSpin";
import UserContext from "../../contexts/UserContext";
import { errorMessage } from "../../helpers/gql";
import { hasPermissions } from "../../helpers/permissions";
import { RoleTagStringToColor } from "../../helpers/style";
import Permission from "../../models/Permission";
import classes from "./Permissions.module.css";

const Permissions = () => {
  const { user } = useContext(UserContext);
  const { id }: any = useParams();
  const navigate = useNavigate();

  const [
    getAllPermissions,
    { data: allPermissions, loading: loadingAllPermissions },
  ] = useLazyQuery(GET_ALL_PERMISSIONS, {
    onError: (err) => {
      errorMessage(err, "Error loading all permissions.");
    },
  });

  const [togglePermission, { loading }] = useMutation(TOGGLE_PERMISSION, {
    refetchQueries: ["me", "getRoleWithPermission"],
    onError: (error) => {
      errorMessage(error, "Unexpected error while assigning permission.");
    },
  });

  const [
    getRoleWithPermission,
    { data: roleData, loading: loadingRoleWithPermission },
  ] = useLazyQuery(GET_ROLE_WITH_PERMISSION, {
    onError: (error) => {
      errorMessage(error, "Unexpected error while loading role");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  // Set permissions when component mounts
  useEffect(() => {
    getAllPermissions();
    getRoleWithPermission({
      variables: {
        roleId: parseInt(id),
      },
    });
  }, [getAllPermissions, getRoleWithPermission]);

  let permissions = allPermissions?.permissions;
  if (!hasPermissions(user, ["MODIFY_DEVELOPER_PERMISSIONS"])) {
    permissions = permissions?.filter(
      (p: Permission) => p.type !== "Developer"
    );
  }

  const uniqueTypes: string[] = [
    ...new Set(permissions?.map((p: Permission) => p.type) as string[]),
  ];

  const hasPermission = (permission: string) => {
    if (!allPermissions || !roleData) return false;
    const userPermissions = roleData.getRoleWithPermission.permissionRoles.map(
      (p: any) => p.permission
    );
    if (userPermissions.includes(permission)) return true;
  };

  return (
    <div className={classes["container"]}>
      <div style={{ marginTop: "10px" }}>
        <Button
          className="secondaryButton"
          onClick={() => navigate(-1)}
          icon={<LeftOutlined />}
        >
          Back
        </Button>
      </div>
      <div className={classes["title-wrapper"]}>
        <Tag
          style={{
            backgroundColor: RoleTagStringToColor(
              roleData?.getRoleWithPermission?.name
            ),
            borderColor: RoleTagStringToColor(
              roleData?.getRoleWithPermission?.name
            ),
            borderWidth: 1,
          }}
          className={classes["tag"]}
        >
          {roleData?.getRoleWithPermission?.name}
        </Tag>
        <span className={classes["title"]}>Permissions</span>
      </div>

      {(loadingAllPermissions || loadingRoleWithPermission) && <CenteredSpin />}
      {uniqueTypes?.map((type) => (
        <div key={type}>
          <Divider style={{ marginTop: 10 }} />
          <Typography.Title level={5}>{type}</Typography.Title>
          {allPermissions?.permissions
            .filter((p: Permission) => p.type === type)
            .map((p: Permission) => (
              <div
                key={p.name}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Switch
                  checked={hasPermission(p.name)}
                  onChange={(e) =>
                    togglePermission({
                      variables: {
                        roleId: parseInt(id),
                        permission: p.name,
                        complete: e,
                      },
                    })
                  }
                />
                <div style={{ marginLeft: ".5rem" }}>
                  {p.name}
                  <div style={{ opacity: 0.7, marginTop: -5 }}>
                    {p.description}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Permissions;
