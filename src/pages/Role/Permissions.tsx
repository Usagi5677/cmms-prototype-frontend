import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Breadcrumb,
  Button,
  Divider,
  Result,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { TOGGLE_PERMISSION } from "../../api/mutations";
import {
  GET_ALL_PERMISSIONS,
  GET_ROLE_WITH_PERMISSION,
} from "../../api/queries";
import { CenteredSpin } from "../../components/common/CenteredSpin";
import UserContext from "../../contexts/UserContext";
import { NO_AUTH_MESSAGE_THREE } from "../../helpers/constants";
import { errorMessage } from "../../helpers/gql";
import { hasPermissions } from "../../helpers/permissions";
import { RoleTagStringToColor } from "../../helpers/style";
import Permission from "../../models/Permission";
import classes from "./Permissions.module.css";

const Permissions = () => {
  const { user: self } = useContext(UserContext);
  const { id }: any = useParams();
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

  useEffect(() => {
    getAllPermissions();
    getRoleWithPermission({
      variables: {
        roleId: parseInt(id),
      },
    });
  }, [getAllPermissions, getRoleWithPermission]);

  let permissions = allPermissions?.permissions;
  if (!hasPermissions(self, ["MODIFY_DEVELOPER_PERMISSIONS"])) {
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

  return !hasPermissions(self, ["VIEW_PERMISSION"]) ? (
    <Result
      status="403"
      title="403"
      subTitle={NO_AUTH_MESSAGE_THREE}
      extra={
        <Button
          type="primary"
          onClick={() => `${window.open("https://helpdesk.mtcc.com.mv/")}`}
          style={{ borderRadius: 2 }}
        >
          Get Help
        </Button>
      }
    />
  ) : (
    <>
      <Breadcrumb style={{ marginBottom: 6 }}>
        <Breadcrumb.Item>
          <Link to={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={"/roles"}>Roles</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {roleData?.getRoleWithPermission?.name}
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={classes["container"]}>
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
          <span className={classes["title"]}>permissions</span>
        </div>

        {(loadingAllPermissions || loadingRoleWithPermission) && (
          <CenteredSpin />
        )}
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
                    loading={loading}
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
    </>
  );
};

export default Permissions;
