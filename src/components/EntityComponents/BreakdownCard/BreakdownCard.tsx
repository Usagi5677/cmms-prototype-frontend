import { Badge, Checkbox, Collapse, Divider, Spin, Tag, Tooltip } from "antd";
import moment from "moment";
import { FaCarCrash, FaRegClock, FaRegUser } from "react-icons/fa";
import {
  REMOVE_BREAKDOWN_COMMENT,
  TOGGLE_BREAKDOWN_COMPLETE,
} from "../../../api/mutations";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import BreakdownDetail from "../../../models/BreakdownDetails";
import Breakdown from "../../../models/Entity/Breakdown";
import Repair from "../../../models/Entity/Repair";
import { AddBreakdownObservation } from "../../common/AddBreakdownObservation";
import { CommentCard } from "../../common/CommentCard/CommentCard";
import { AddBreakdownDetail } from "../AddBreakdownDetail";
import { AddRepairDetail } from "../AddRepairDetail";
import BreakdownDetailCard from "../BreakdownDetailCard/BreakdownDetailCard";
import DeleteBreakdown from "../DeleteBreakdown/DeleteBreakdown";
import EditBreakdown from "../EditEntityBreakdown/EditBreakdown";
import Comment from "../../../models/Comment";
import classes from "./BreakdownCard.module.css";
import RepairDetailCard from "../RepairDetailCard/RepairDetailCard";
import {
  CommentOutlined,
  RightOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { hasPermissions, isAssignedType } from "../../../helpers/permissions";
import { memo, useContext, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import { errorMessage } from "../../../helpers/gql";
import { useMutation } from "@apollo/client";
import { Entity } from "../../../models/Entity/Entity";

const EntityBreakdownCard = ({
  breakdown,
  isDeleted,
  entity,
}: {
  breakdown: Breakdown;
  isDeleted?: boolean | undefined;
  entity?: Entity;
}) => {
  const { user: self } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [toggle, { loading: toggling }] = useMutation(
    TOGGLE_BREAKDOWN_COMPLETE,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating complete.");
      },
      refetchQueries: ["breakdowns", "getAllHistoryOfEntity"],
    }
  );

  let rCommentExist = false;
  breakdown?.repairs?.map((c) => {
    if (c.comments?.length! > 0) {
      rCommentExist = true;
    }
  });

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
                    <div className={classes["detail-wrapper"]}>
                      <div className={classes["indicators"]}>
                        {breakdown?.comments?.length! > 0 || rCommentExist ? (
                          <CommentOutlined
                            style={{
                              marginRight: 10,
                            }}
                          />
                        ) : null}
                        {breakdown?.repairs?.length! > 0 && (
                          <Tooltip
                            color="var(--dot-tooltip)"
                            title={
                              <div>
                                <Badge
                                  color={"#52c41a"}
                                  text={"Repair added"}
                                />
                              </div>
                            }
                          >
                            <Badge
                              color={"#52c41a"}
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            />
                          </Tooltip>
                        )}
                      </div>
                      {breakdown?.details[0]?.description && (
                        <Tooltip title={"Detail"}>
                          <span className={classes["title"]}>
                            {breakdown?.details[0]?.description}
                          </span>
                        </Tooltip>
                      )}
                    </div>
                    <div className={classes["actions"]}>
                      <RightOutlined
                        style={{
                          rotate: isOpen ? "90deg" : "0deg",
                          transition: "rotate 0.3s ease",
                        }}
                      />
                      {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ||
                      isAssignedType("Admin", entity!, self) ||
                      isAssignedType("Engineer", entity!, self) ? (
                        <EditBreakdown
                          breakdown={breakdown}
                          isDeleted={isDeleted}
                        />
                      ) : null}
                      {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ||
                      isAssignedType("Admin", entity!, self) ||
                      isAssignedType("Engineer", entity!, self) ? (
                        <DeleteBreakdown
                          id={breakdown.id}
                          isDeleted={isDeleted}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className={classes["level-two"]}>
                    <div className={classes["date-wrapper"]}>
                      <Checkbox
                        className={classes["checkbox"]}
                        checked={breakdown?.completedAt !== null}
                        disabled={
                          (!hasPermissions(self, ["MODIFY_BREAKDOWN"]) &&
                            !isAssignedType("Admin", entity!, self) &&
                            !isAssignedType("Engineer", entity!, self)) ||
                          isDeleted
                        }
                        onChange={(e) =>
                          toggle({
                            variables: {
                              id: breakdown.id,
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
                            {moment(breakdown?.createdAt).format(
                              DATETIME_FORMATS.SHORT
                            )}
                          </span>
                        </Tooltip>
                      </div>
                      <Divider className={classes["divider"]} type="vertical" />
                      <div className={classes["icon-text-wrapper"]}>
                        {breakdown?.estimatedDateOfRepair ? (
                          <div className={classes["icon-text-wrapper"]}>
                            <Tooltip title="Estimated Date of Repair">
                              <span
                                style={{
                                  color: "#33bcb7",
                                  fontWeight: 700,
                                }}
                              >
                                {moment(
                                  breakdown?.estimatedDateOfRepair
                                ).format(DATETIME_FORMATS.SHORT)}
                              </span>
                            </Tooltip>
                          </div>
                        ) : (
                          <div className={classes["icon-text-wrapper"]}>
                            <Tooltip title="Estimated Date of Repair">
                              <span>None</span>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={classes["tag-wrapper"]}>
                      <Tag
                        color={
                          breakdown?.type === "Breakdown" ? "red" : "orange"
                        }
                        style={{
                          fontWeight: 700,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        {breakdown?.type}
                      </Tag>
                    </div>
                  </div>
                  <div className={classes["level-three"]}>
                    <div className={classes["icon-text-opac-wrapper"]}>
                      <ToolOutlined className={classes["icon"]} />
                      <span>{breakdown?.id}</span>
                    </div>
                    <Divider className={classes["divider"]} type="vertical" />
                    <Tooltip title="Created By">
                      <div className={classes["icon-text-opac-wrapper"]}>
                        <FaRegUser />
                        <span>
                          {breakdown?.createdBy?.fullName}{" "}
                          {"(" + breakdown?.createdBy?.rcno + ")"}
                        </span>
                      </div>
                    </Tooltip>

                    <Divider className={classes["divider"]} type="vertical" />
                    {!breakdown?.completedAt && (
                      <Tooltip title="Duration">
                        <div className={classes["icon-text-opac-wrapper"]}>
                          <FaCarCrash className={classes["icon"]} />
                          <span>{moment(breakdown?.createdAt).fromNow()}</span>
                        </div>
                      </Tooltip>
                    )}
                    {breakdown?.completedAt && (
                      <Divider className={classes["divider"]} type="vertical" />
                    )}
                    {breakdown?.completedAt && (
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
                            {moment(breakdown?.completedAt).format(
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
          key={breakdown.id}
        >
          <div className={classes["collapse-container"]}>
            <div className={classes["inner-block-wrapper"]}>
              <div className={classes["inner-block"]}>
                <span className={classes["inner-header"]}>
                  Breakdown Details
                </span>
                <Divider style={{ marginTop: 4 }} />
                {breakdown?.details ? (
                  <div className={classes["detail-container"]}>
                    {breakdown?.details?.map(
                      (b: BreakdownDetail, index: number) => (
                        <>
                          <BreakdownDetailCard
                            index={index}
                            breakdown={breakdown}
                            detail={b}
                            hasPermission={
                              hasPermissions(self, ["MODIFY_BREAKDOWN"]) ||
                              isAssignedType("Admin", entity!, self) ||
                              isAssignedType("Engineer", entity!, self)
                            }
                            key={b.id}
                          />
                          {breakdown?.details?.length !== index + 1 && (
                            <Divider
                              style={{ marginTop: 4, marginBottom: 4 }}
                            />
                          )}
                        </>
                      )
                    )}
                  </div>
                ) : (
                  <div style={{ marginBottom: 20 }}>None</div>
                )}
                {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ||
                isAssignedType("Admin", entity!, self) ||
                isAssignedType("Engineer", entity!, self) ||
                !isDeleted ? (
                  <AddBreakdownDetail breakdownId={breakdown.id} />
                ) : null}
              </div>
              <div className={classes["inner-block"]}>
                <span className={classes["inner-header"]}>Repair Details</span>
                <Divider style={{ marginTop: 4 }} />
                {breakdown?.repairs ? (
                  <div className={classes["detail-container"]}>
                    {breakdown?.repairs?.map((r: Repair, index: number) => (
                      <>
                        <RepairDetailCard
                          index={index}
                          repair={r}
                          key={r.id}
                          hasPermission={
                            hasPermissions(self, ["MODIFY_BREAKDOWN"]) ||
                            isAssignedType("Admin", entity!, self) ||
                            isAssignedType("Engineer", entity!, self)
                          }
                        />
                        {breakdown?.repairs?.length !== index + 1 && (
                          <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                        )}
                      </>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginBottom: 20 }}>None</div>
                )}
                {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ||
                isAssignedType("Admin", entity!, self) ||
                isAssignedType("Engineer", entity!, self) ||
                !isDeleted ? (
                  <AddRepairDetail breakdownId={breakdown.id} />
                ) : null}
              </div>
            </div>
            {breakdown?.comments?.map((c: Comment) => (
              <CommentCard
                comment={c}
                key={c.id}
                isDeleted={isDeleted}
                mutation={REMOVE_BREAKDOWN_COMMENT}
                refetchQueries={["breakdowns", "getAllHistoryOfEntity"]}
              />
            ))}
            <div style={{ marginTop: 20 }}>
              {!isDeleted && (
                <AddBreakdownObservation
                  breakdownId={breakdown.id}
                  type={"Observation"}
                  placeholder={"Add new observation"}
                  isDeleted={isDeleted}
                />
              )}
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default memo(EntityBreakdownCard);
