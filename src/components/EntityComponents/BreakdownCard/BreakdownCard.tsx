import { Badge, Checkbox, Collapse, Spin, Tag, Tooltip } from "antd";
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
import { CommentOutlined, ToolOutlined } from "@ant-design/icons";
import { hasPermissions } from "../../../helpers/permissions";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import { errorMessage } from "../../../helpers/gql";
import { useMutation } from "@apollo/client";

const EntityBreakdownCard = ({
  breakdown,
  isDeleted,
}: {
  breakdown: Breakdown;
  isDeleted?: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);

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
                onClick={(event) => event.stopPropagation()}
              >
                <div className={classes["level-one"]}>
                  <div className={classes["info-wrapper"]}>
                    <div className={classes["first-block"]}>
                      <div className={classes["space-two"]}>
                        <Checkbox
                          checked={breakdown?.completedAt !== null}
                          disabled={
                            !hasPermissions(self, ["MODIFY_BREAKDOWN"]) ||
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
                          Complete{" "}
                          {toggling && (
                            <Spin style={{ marginRight: 5 }} size="small" />
                          )}
                        </Checkbox>
                      </div>

                      <div
                        className={
                          (classes["title-wrapper"], classes["space-two"])
                        }
                      >
                        {breakdown?.estimatedDateOfRepair ? (
                          <>
                            <Tooltip title="Estimated Date of Repair">
                              <FaRegClock className={classes["icon"]} />
                            </Tooltip>
                            <span
                              className={classes["title"]}
                              title={moment(
                                breakdown?.estimatedDateOfRepair
                              ).format(DATETIME_FORMATS.FULL)}
                            >
                              {moment(breakdown?.estimatedDateOfRepair).format(
                                DATETIME_FORMATS.SHORT
                              )}
                            </span>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Estimated Date of Repair">
                              <FaRegClock className={classes["icon"]} />
                            </Tooltip>
                            <span className={classes["title"]}>None</span>
                          </>
                        )}
                      </div>
                      <div
                        className={(classes["reading"], classes["space-two"])}
                      >
                        <span className={classes["reading-title"]}>Type:</span>
                        <Tag
                          color={
                            breakdown?.type === "Breakdown" ? "red" : "orange"
                          }
                          style={{
                            fontWeight: 700,
                            borderRadius: 20,
                            textAlign: "center",
                            maxWidth: 250,
                          }}
                        >
                          {breakdown?.type}
                        </Tag>
                      </div>
                      <div
                        className={
                          (classes["reading"],
                          classes["space-two"],
                          classes["flex-limit"])
                        }
                      >
                        <span className={classes["reading-title"]}>Name:</span>
                        {breakdown?.name}
                      </div>
                    </div>
                    <div className={classes["second-block"]}>
                      {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ? (
                        <EditBreakdown
                          breakdown={breakdown}
                          isDeleted={isDeleted}
                        />
                      ) : null}
                      {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ? (
                        <DeleteBreakdown
                          id={breakdown.id}
                          isDeleted={isDeleted}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={classes["level-two"]}>
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
                            <Badge color={"#52c41a"} text={"Repair added"} />
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

                  <div className={(classes["id-wrapper"], classes["space"])}>
                    <ToolOutlined className={classes["icon"]} />
                    <span className={classes["title"]}>{breakdown?.id}</span>
                  </div>
                  <div className={(classes["title-wrapper"], classes["space"])}>
                    <Tooltip title="Created Date">
                      <FaRegClock className={classes["icon"]} />
                    </Tooltip>

                    <span
                      className={classes["title"]}
                      title={moment(breakdown?.createdAt).format(
                        DATETIME_FORMATS.FULL
                      )}
                    >
                      {moment(breakdown?.createdAt).format(
                        DATETIME_FORMATS.SHORT
                      )}
                    </span>
                  </div>
                  <div
                    className={(classes["createdBy-wrapper"], classes["space"])}
                  >
                    <Tooltip title="Created by">
                      <FaRegUser />
                    </Tooltip>
                    <div className={classes["createdBy"]}>
                      {breakdown?.createdBy?.fullName}{" "}
                      {"(" + breakdown?.createdBy?.rcno + ")"}
                    </div>
                  </div>
                  {!breakdown?.completedAt && (
                    <div
                      className={(classes["title-wrapper"], classes["space"])}
                    >
                      <Tooltip title="Breakdown Duration">
                        <FaCarCrash className={classes["icon"]} />
                      </Tooltip>

                      <span className={classes["title"]}>
                        {moment(breakdown?.createdAt).fromNow()}
                      </span>
                    </div>
                  )}
                  {breakdown?.completedAt && (
                    <div
                      className={classes["title-wrapper"]}
                      style={{ color: "#52c41a", fontWeight: 700 }}
                    >
                      <Tooltip title="Completed Date">
                        <FaRegClock className={classes["icon"]} />
                      </Tooltip>

                      <span
                        className={classes["title"]}
                        title={moment(breakdown?.completedAt).format(
                          DATETIME_FORMATS.FULL
                        )}
                      >
                        {moment(breakdown?.completedAt).format(
                          DATETIME_FORMATS.SHORT
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          }
          key={breakdown.id}
        >
          <div className={classes["collapse-container"]}>
            <div className={classes["inner-info"]}></div>
            <div className={classes["flex"]}>
              <div className={classes["inner-block"]}>
                <span className={classes["inner-header"]}>
                  Breakdown Details
                </span>
                {breakdown?.details ? (
                  <div className={classes["detail-container"]}>
                    {breakdown?.details?.map(
                      (b: BreakdownDetail, index: number) => (
                        <BreakdownDetailCard
                          index={index}
                          breakdown={breakdown}
                          detail={b}
                          key={b.id}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div style={{ marginBottom: 20 }}>None</div>
                )}
                {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ? (
                  <AddBreakdownDetail breakdownId={breakdown.id} />
                ) : null}
              </div>
              <div className={classes["inner-block"]}>
                <span className={classes["inner-header"]}>Repair Details</span>
                {breakdown?.repairs ? (
                  <div className={classes["detail-container"]}>
                    {breakdown?.repairs?.map((r: Repair, index: number) => (
                      <RepairDetailCard index={index} repair={r} key={r.id} />
                    ))}
                  </div>
                ) : (
                  <div style={{ marginBottom: 20 }}>None</div>
                )}
                {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ? (
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
            {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ? (
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
            ) : null}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default EntityBreakdownCard;
