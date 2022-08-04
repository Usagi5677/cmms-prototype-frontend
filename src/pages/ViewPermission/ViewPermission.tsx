import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Switch,
  Tag,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

import { useEffect } from "react";
import { FaArrowLeft, FaRegClock, FaUserAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { TOGGLE_PERMISSION } from "../../api/mutations";
import { GET_ROLE_WITH_PERMISSION, ME_QUERY } from "../../api/queries";
import {
  DASHBOARD_PERMISSIONS,
  DATETIME_FORMATS,
  ENTITY_ADD_PERMISSIONS,
  ENTITY_DELETE_PERMISSIONS,
  ENTITY_EDIT_PERMISSIONS,
  ENTITY_MISC_PERMISSIONS,
  ENTITY_VIEW_PERMISSIONS,
  MACHINE_ADD_PERMISSIONS,
  MACHINE_DELETE_PERMISSIONS,
  MACHINE_EDIT_PERMISSIONS,
  MACHINE_MISC_PERMISSIONS,
  MACHINE_VIEW_PERMISSIONS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  TRANSPORTATION_ADD_PERMISSIONS,
  TRANSPORTATION_DELETE_PERMISSIONS,
  TRANSPORTATION_EDIT_PERMISSIONS,
  TRANSPORTATION_MISC_PERMISSIONS,
  TRANSPORTATION_VIEW_PERMISSIONS,
  USER_PERMISSIONS,
} from "../../helpers/constants";
import { errorMessage } from "../../helpers/gql";
import { RoleTagStringToColor } from "../../helpers/style";
import PermissionRole from "../../models/PermissionRole";
import Role from "../../models/Role";

import classes from "./ViewPermission.module.css";

const ViewPermission = ({ role }: { role?: Role }) => {
  const { id }: any = useParams();
  const navigate = useNavigate();
  const [togglePermission, { loading }] = useMutation(TOGGLE_PERMISSION, {
    refetchQueries: [{ query: ME_QUERY }],
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
    getRoleWithPermission({
      variables: {
        roleId: parseInt(id),
      },
    });
  }, [getRoleWithPermission]);

  let machineAddPermissions;
  let machineEditPermissions;
  let machineDeletePermissions;
  let machineViewPermissions;
  let machineMiscPermissions;
  let transportationAddPermissions;
  let transportationEditPermissions;
  let transportationDeletePermissions;
  let transportationViewPermissions;
  let transportationMiscPermissions;
  let entityAddPermissions;
  let entityEditPermissions;
  let entityDeletePermissions;
  let entityViewPermissions;
  let entityMiscPermissions;
  let dashboardPermissions;
  let rolePermissions;
  let userPermissions;
  if (roleData?.getRoleWithPermission?.permissionRoles) {
    machineAddPermissions = MACHINE_ADD_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    machineEditPermissions = MACHINE_EDIT_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    machineDeletePermissions = MACHINE_DELETE_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    machineViewPermissions = MACHINE_VIEW_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    machineMiscPermissions = MACHINE_MISC_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    transportationAddPermissions = TRANSPORTATION_ADD_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    transportationEditPermissions = TRANSPORTATION_EDIT_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    transportationDeletePermissions = TRANSPORTATION_DELETE_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    transportationViewPermissions = TRANSPORTATION_VIEW_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    transportationMiscPermissions = TRANSPORTATION_MISC_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    entityAddPermissions = ENTITY_ADD_PERMISSIONS?.map((permission, index) => {
      let exist = false;
      roleData?.getRoleWithPermission?.permissionRoles.forEach(
        (data: PermissionRole) => {
          if (data.permission === permission) {
            exist = true;
          }
        }
      );
      return (
        <div key={index} className={classes["switch-wrapper"]}>
          <div className={classes["switch-title"]}>
            <span className={classes["bold"]}>{index + 1})</span>
            {permission}
          </div>
          <Switch
            defaultChecked={exist}
            className={classes["checkbox"]}
            size={"small"}
            onChange={(e) =>
              togglePermission({
                variables: {
                  roleId: parseInt(id),
                  permission: permission,
                  complete: e,
                },
              })
            }
            loading={loading}
          />
        </div>
      );
    });

    entityEditPermissions = ENTITY_EDIT_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    entityDeletePermissions = ENTITY_DELETE_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    entityViewPermissions = ENTITY_VIEW_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );

    entityMiscPermissions = ENTITY_MISC_PERMISSIONS?.map(
      (permission, index) => {
        let exist = false;
        roleData?.getRoleWithPermission?.permissionRoles.forEach(
          (data: PermissionRole) => {
            if (data.permission === permission) {
              exist = true;
            }
          }
        );
        return (
          <div key={index} className={classes["switch-wrapper"]}>
            <div className={classes["switch-title"]}>
              <span className={classes["bold"]}>{index + 1})</span>
              {permission}
            </div>
            <Switch
              defaultChecked={exist}
              className={classes["checkbox"]}
              size={"small"}
              onChange={(e) =>
                togglePermission({
                  variables: {
                    roleId: parseInt(id),
                    permission: permission,
                    complete: e,
                  },
                })
              }
              loading={loading}
            />
          </div>
        );
      }
    );
    dashboardPermissions = DASHBOARD_PERMISSIONS?.map((permission, index) => {
      let exist = false;
      roleData?.getRoleWithPermission?.permissionRoles.forEach(
        (data: PermissionRole) => {
          if (data.permission === permission) {
            exist = true;
          }
        }
      );
      return (
        <div key={index} className={classes["switch-wrapper"]}>
          <div className={classes["switch-title"]}>
            <span className={classes["bold"]}>{index + 1})</span>
            {permission}
          </div>
          <Switch
            defaultChecked={exist}
            className={classes["checkbox"]}
            size={"small"}
            onChange={(e) =>
              togglePermission({
                variables: {
                  roleId: parseInt(id),
                  permission: permission,
                  complete: e,
                },
              })
            }
            loading={loading}
          />
        </div>
      );
    });

    rolePermissions = ROLE_PERMISSIONS?.map((permission, index) => {
      let exist = false;
      roleData?.getRoleWithPermission?.permissionRoles.forEach(
        (data: PermissionRole) => {
          if (data.permission === permission) {
            exist = true;
          }
        }
      );
      return (
        <div key={index} className={classes["switch-wrapper"]}>
          <div className={classes["switch-title"]}>
            <span className={classes["bold"]}>{index + 1})</span>
            {permission}
          </div>
          <Switch
            defaultChecked={exist}
            className={classes["checkbox"]}
            size={"small"}
            onChange={(e) =>
              togglePermission({
                variables: {
                  roleId: parseInt(id),
                  permission: permission,
                  complete: e,
                },
              })
            }
            loading={loading}
          />
        </div>
      );
    });

    userPermissions = USER_PERMISSIONS?.map((permission, index) => {
      let exist = false;
      roleData?.getRoleWithPermission?.permissionRoles.forEach(
        (data: PermissionRole) => {
          if (data.permission === permission) {
            exist = true;
          }
        }
      );
      return (
        <div key={index} className={classes["switch-wrapper"]}>
          <div className={classes["switch-title"]}>
            <span className={classes["bold"]}>{index + 1})</span>
            {permission}
          </div>
          <Switch
            defaultChecked={exist}
            className={classes["checkbox"]}
            size={"small"}
            onChange={(e) =>
              togglePermission({
                variables: {
                  roleId: parseInt(id),
                  permission: permission,
                  complete: e,
                },
              })
            }
            loading={loading}
          />
        </div>
      );
    });
  }

  return (
    <>
      <div className={classes["container"]}>
        <div className={classes["title"]}>
          <FaArrowLeft
            className={classes["back-btn"]}
            onClick={() => navigate(-1)}
          />
          Role Information
        </div>
        {loadingRoleWithPermission ? (
          <Spin />
        ) : (
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
            <div className={classes["secondary"]}>
              <div className={classes["user-icon"]}>
                <Tooltip title={"Created By"}>
                  <FaUserAlt />
                </Tooltip>
              </div>
              {roleData?.getRoleWithPermission?.createdBy?.fullName} (
              {roleData?.getRoleWithPermission?.createdBy?.rcno})
            </div>
            <div className={classes["time-wrapper"]}>
              <Tooltip title="Created At">
                <FaRegClock style={{ fontSize: 12 }} />
              </Tooltip>
              <div className={classes["time"]}>
                {moment(roleData?.getRoleWithPermission?.createdAt).format(
                  DATETIME_FORMATS.FULL
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={classes["perm-container"]}>
        <div className={classes["heading"]}>Machine</div>
        <div className={classes["stretch"]}>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Add</div>
            {loadingRoleWithPermission ? <Spin /> : machineAddPermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Edit</div>
            {loadingRoleWithPermission ? <Spin /> : machineEditPermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Delete</div>
            {loadingRoleWithPermission ? <Spin /> : machineDeletePermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>View</div>
            {loadingRoleWithPermission ? <Spin /> : machineViewPermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Misc</div>
            {loadingRoleWithPermission ? <Spin /> : machineMiscPermissions}
          </div>
        </div>
      </div>

      <div className={classes["perm-container"]}>
        <div className={classes["heading"]}>Transports</div>
        <div className={classes["stretch"]}>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Add</div>
            {loadingRoleWithPermission ? (
              <Spin />
            ) : (
              transportationAddPermissions
            )}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Edit</div>
            {loadingRoleWithPermission ? (
              <Spin />
            ) : (
              transportationEditPermissions
            )}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Delete</div>
            {loadingRoleWithPermission ? (
              <Spin />
            ) : (
              transportationDeletePermissions
            )}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>View</div>
            {loadingRoleWithPermission ? (
              <Spin />
            ) : (
              transportationViewPermissions
            )}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Misc</div>
            {loadingRoleWithPermission ? (
              <Spin />
            ) : (
              transportationMiscPermissions
            )}
          </div>
        </div>
      </div>

      <div className={classes["perm-container"]}>
        <div className={classes["heading"]}>Entity</div>
        <div className={classes["stretch"]}>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Add</div>
            {loadingRoleWithPermission ? <Spin /> : entityAddPermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Edit</div>
            {loadingRoleWithPermission ? <Spin /> : entityEditPermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Delete</div>
            {loadingRoleWithPermission ? <Spin /> : entityDeletePermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>View</div>
            {loadingRoleWithPermission ? <Spin /> : entityViewPermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Misc</div>
            {loadingRoleWithPermission ? <Spin /> : entityMiscPermissions}
          </div>
        </div>
      </div>
      <div className={classes["perm-container"]}>
        <div className={classes["heading"]}>Misc</div>
        <div className={classes["stretch"]}>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Role</div>
            {loadingRoleWithPermission ? <Spin /> : rolePermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>User</div>
            {loadingRoleWithPermission ? <Spin /> : userPermissions}
          </div>
          <div className={classes["inner-container"]}>
            <div className={classes["heading-two"]}>Dashboard</div>
            {loadingRoleWithPermission ? <Spin /> : dashboardPermissions}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPermission;
