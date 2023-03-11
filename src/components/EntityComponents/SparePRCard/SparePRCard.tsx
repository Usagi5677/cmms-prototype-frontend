import { RightOutlined, ToolOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Checkbox, Collapse, Divider, Spin, Tag, Tooltip } from "antd";
import moment from "moment";
import { memo, useContext, useState } from "react";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import { TOGGLE_SPARE_PR_COMPLETE } from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { hasPermissions, isAssignedType } from "../../../helpers/permissions";
import { Entity } from "../../../models/Entity/Entity";
import SparePR from "../../../models/Entity/SparePR";
import { AddSparePRDetail } from "../AddSparePRDetail";
import DeleteSparePR from "../DeleteSparePR/DeleteSparePR";
import EditSparePR from "../EditSparePR/EditSparePR";
import SparePRDetailCard from "../SparePRDetailCard/SparePRDetailCard";
import classes from "./SparePRCard.module.css";

const SparePRCard = ({
  sparePR,
  isDeleted,
  entity,
}: {
  sparePR: SparePR;
  isDeleted: boolean | undefined;
  entity: Entity;
}) => {
  const { user: self } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [toggle, { loading: toggling }] = useMutation(
    TOGGLE_SPARE_PR_COMPLETE,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating complete.");
      },
      refetchQueries: ["sparePRs", "getAllHistoryOfEntity"],
    }
  );
  return (
    <div id="collapseTwo">
      <Collapse ghost style={{ marginBottom: ".5rem" }}>
        <Collapse.Panel
          header={
            <>
              <div
                className={classes["header-container"]}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className={classes["level-wrapper"]}>
                  <div className={classes["level-one"]}>
                    <Tooltip title={"Detail"}>
                      <span className={classes["title"]}>
                        {sparePR?.name}
                      </span>
                    </Tooltip>
                    <div className={classes["actions"]}>
                      <RightOutlined
                        style={{
                          rotate: isOpen ? "90deg" : "0deg",
                          transition: "rotate 0.3s ease",
                        }}
                      />
                      {hasPermissions(self, ["MODIFY_SPARE_PR"]) ||
                      isAssignedType("Admin", entity!, self) ||
                      isAssignedType("Engineer", entity!, self) ? (
                        <EditSparePR sparePR={sparePR} isDeleted={isDeleted} />
                      ) : null}
                      {hasPermissions(self, ["MODIFY_SPARE_PR"]) ||
                      isAssignedType("Admin", entity!, self) ||
                      isAssignedType("Engineer", entity!, self) ? (
                        <DeleteSparePR id={sparePR?.id} isDeleted={isDeleted} />
                      ) : null}
                    </div>
                  </div>
                  <div className={classes["level-two"]}>
                    <div className={classes["date-wrapper"]}>
                      <Checkbox
                        className={classes["checkbox"]}
                        checked={sparePR?.completedAt !== null}
                        disabled={
                          (!hasPermissions(self, ["MODIFY_SPARE_PR"]) &&
                            !isAssignedType("Admin", entity!, self) &&
                            !isAssignedType("Engineer", entity!, self)) ||
                          isDeleted
                        }
                        onChange={(e) =>
                          toggle({
                            variables: {
                              id: sparePR.id,
                              complete: e.target.checked,
                            },
                          })
                        }
                        style={{ wordBreak: "break-all" }}
                      >
                        Complete
                        {toggling && (
                          <Spin style={{ marginRight: 5 }} size="small" />
                        )}
                      </Checkbox>
                      <Divider className={classes["divider"]} type="vertical" />
                      <div className={classes["icon-text-wrapper"]}>
                        <Tooltip title="Created At">
                          <span>
                            {moment(sparePR?.createdAt).format(
                              DATETIME_FORMATS.SHORT
                            )}
                          </span>
                        </Tooltip>
                      </div>
                      <Divider className={classes["divider"]} type="vertical" />
                      <div className={classes["icon-text-wrapper"]}>
                        {sparePR?.requestedDate ? (
                          <div className={classes["icon-text-wrapper"]}>
                            <Tooltip title="Requested Date">
                              <span
                                style={{
                                  color: "#33bcb7",
                                  fontWeight: 700,
                                }}
                              >
                                {moment(sparePR?.requestedDate).format(
                                  DATETIME_FORMATS.SHORT
                                )}
                              </span>
                            </Tooltip>
                          </div>
                        ) : (
                          <div className={classes["icon-text-wrapper"]}>
                            <Tooltip title="Requested Date">
                              <span>None</span>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={classes["level-three"]}>
                    <div className={classes["icon-text-opac-wrapper"]}>
                      <ToolOutlined className={classes["icon"]} />
                      <span>{sparePR?.id}</span>
                    </div>
                    <Divider className={classes["divider"]} type="vertical" />
                    <Tooltip title="Created By">
                      <div className={classes["icon-text-opac-wrapper"]}>
                        <FaRegUser />
                        <span>
                          {sparePR?.createdBy?.fullName}{" "}
                          {"(" + sparePR?.createdBy?.rcno + ")"}
                        </span>
                      </div>
                    </Tooltip>

                    {sparePR?.completedAt && (
                      <Divider className={classes["divider"]} type="vertical" />
                    )}
                    {sparePR?.completedAt && (
                      <Tooltip title="Completed Date">
                        <div
                          className={classes["icon-text-opac-wrapper"]}
                          style={{
                            color: "#52c41a",
                            fontWeight: 700,
                            opacity: 1,
                          }}
                        >
                          <FaRegClock className={classes["icon"]} />
                          <span>
                            {moment(sparePR?.completedAt).format(
                              DATETIME_FORMATS.SHORT
                            )}
                          </span>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </>
          }
          key={sparePR.id}
        >
          <div className={classes["collapse-container"]}>
            <span className={classes["inner-header"]}>Details</span>
            <Divider style={{ marginTop: 4 }} />
            {sparePR?.sparePRDetails?.map((d, index) => (
              <>
                <SparePRDetailCard
                  key={d.id}
                  sparePRDetail={d}
                  hasPermission={
                    hasPermissions(self, ["MODIFY_SPARE_PR"]) ||
                    isAssignedType("Admin", entity, self) ||
                    isAssignedType("Engineer", entity, self)
                  }
                />
                {sparePR?.sparePRDetails?.length !== index + 1 && (
                  <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                )}
              </>
            ))}
            <div style={{ marginTop: 10 }}>
              <AddSparePRDetail sparePRId={sparePR.id} />
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default memo(SparePRCard);
