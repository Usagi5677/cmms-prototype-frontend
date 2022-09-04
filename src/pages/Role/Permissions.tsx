import { LeftOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Divider, Switch, Tag, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { TOGGLE_PERMISSION } from "../../api/mutations";
import {
  GET_ALL_PERMISSIONS,
  GET_ROLE_WITH_PERMISSION,
} from "../../api/queries";
import { CenteredSpin } from "../../components/common/CenteredSpin";
import { errorMessage } from "../../helpers/gql";
import { RoleTagStringToColor } from "../../helpers/style";
import Permission from "../../models/Permission";

const Permissions = () => {
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

  const uniqueTypes: string[] = [
    ...new Set(
      allPermissions?.permissions.map((p: Permission) => p.type) as string[]
    ),
  ];

  const hasPermission = (permission: string) => {
    if (!allPermissions || !roleData) return false;
    const userPermissions = roleData.getRoleWithPermission.permissionRoles.map(
      (p: any) => p.permission
    );
    if (userPermissions.includes(permission)) return true;
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "var(--card-bg)",
        borderRadius: 20,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: 10,
        paddingTop: 5,
        paddingLeft: 15,
        border: "var(--card-border)"
      }}
    >
      <div style={{ marginTop: "1rem", display: "flex" }}>
        <Button
          className="secondaryButton"
          onClick={() => navigate(-1)}
          icon={<LeftOutlined />}
        >
          Back
        </Button>
        <Typography.Title level={3} style={{ marginLeft: "1rem" }}>
          Role Permissions
        </Typography.Title>
      </div>
      <div>
        <Tag
          style={{
            fontWeight: 700,
            borderRadius: 20,
            textAlign: "center",
            maxWidth: "fit-content",
            backgroundColor: RoleTagStringToColor(
              roleData?.getRoleWithPermission?.name
            ),
            borderColor: RoleTagStringToColor(
              roleData?.getRoleWithPermission?.name
            ),
            borderWidth: 1,
          }}
        >
          {roleData?.getRoleWithPermission?.name}
        </Tag>
      </div>
      {(loadingAllPermissions || loadingRoleWithPermission) && <CenteredSpin />}
      {uniqueTypes?.map((type) => (
        <div key={type}>
          <Divider />
          <Typography.Title level={5}>{type}</Typography.Title>
          {}
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
