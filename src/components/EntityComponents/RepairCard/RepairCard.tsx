import { CommentOutlined, ToolOutlined } from "@ant-design/icons";
import { Collapse, Tag, Tooltip } from "antd";
import moment from "moment";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import { REMOVE_REPAIR_COMMENT } from "../../../api/mutations";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import Repair from "../../../models/Entity/Repair";
import { CommentCard } from "../../common/CommentCard/CommentCard";
import DeleteRepair from "../DeleteRepair/DeleteRepair";
import EditRepair from "../EditRepair/EditRepair";
import classes from "./RepairCard.module.css";
import Comment from "../../../models/Comment";
import { AddRepairComment } from "../AddRepairComment";
import { AddRepairObservation } from "../../common/AddRepairObservation";
import { hasPermissions, isAssignedType } from "../../../helpers/permissions";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import { Entity } from "../../../models/Entity/Entity";

const RepairCard = ({
  repair,
  isDeleted,
  entity,
}: {
  repair: Repair;
  isDeleted?: boolean;
  entity?: Entity;
}) => {
  const { user: self } = useContext(UserContext);
  const remarkComments = repair?.comments?.filter(
    (c: Comment) => c.type === "Remark"
  );
  const observationComments = repair?.comments?.filter(
    (c: Comment) => c.type === "Observation"
  );
  const breakdownExist = repair?.breakdown;

  return (
    <div id="collapseTwo">
      <Collapse ghost style={{ marginBottom: ".5rem" }}>
        <Collapse.Panel
          header={
            <>
              <div className={classes["header-container"]}>
                <div className={classes["level-one"]}>
                  <div className={classes["info-wrapper"]}>
                    <div className={classes["first-block"]}>
                      <div className={classes["reading"]}>
                        <span className={classes["reading-title"]}>Name:</span>
                        {repair?.name}
                      </div>
                    </div>
                    <div
                      className={classes["second-block"]}
                      style={{
                        visibility: breakdownExist ? "visible" : "initial",
                      }}
                    >
                      {breakdownExist && (
                        <div className={classes["reading"]}>
                          <span className={classes["reading-title"]}>
                            Breakdown Type:
                          </span>
                          <Tag
                            color={
                              repair?.breakdown?.type === "Breakdown"
                                ? "red"
                                : "orange"
                            }
                            style={{
                              fontWeight: 700,
                              borderRadius: 20,
                              textAlign: "center",
                              maxWidth: 250,
                            }}
                          >
                            {repair?.breakdown?.type}
                          </Tag>
                        </div>
                      )}
                      {breakdownExist && (
                        <div
                          className={
                            (classes["reading"], classes["flex-limit"])
                          }
                        >
                          <span className={classes["reading-title"]}>
                            Breakdown Name:
                          </span>
                          ({repair?.breakdown?.id}) {repair?.breakdown?.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={classes["third-block"]}>
                    <div style={{ marginRight: 8, marginTop: 4 }}>
                      <AddRepairComment repair={repair} isDeleted={isDeleted} />
                    </div>
                    {hasPermissions(self, ["MODIFY_REPAIR_REQUEST"]) ||
                    isAssignedType("Admin", entity!, self) ||
                    isAssignedType("Engineer", entity!, self) ? (
                      <EditRepair repair={repair} isDeleted={isDeleted} />
                    ) : null}
                    {hasPermissions(self, ["MODIFY_REPAIR_REQUEST"]) ||
                    isAssignedType("Admin", entity!, self) ||
                    isAssignedType("Engineer", entity!, self) ? (
                      <DeleteRepair id={repair.id} isDeleted={isDeleted} />
                    ) : null}
                  </div>
                </div>
                <div className={classes["level-two"]}>
                  {repair?.comments?.length! > 0 ? (
                    <CommentOutlined
                      style={{
                        marginRight: 10,
                      }}
                    />
                  ) : null}
                  <div className={(classes["id-wrapper"], classes["space"])}>
                    <ToolOutlined className={classes["icon"]} />
                    <span className={classes["title"]}>{repair?.id}</span>
                  </div>
                  <div className={(classes["title-wrapper"], classes["space"])}>
                    <Tooltip title="Created Date">
                      <FaRegClock className={classes["icon"]} />
                    </Tooltip>

                    <span
                      className={classes["title"]}
                      title={moment(repair?.createdAt).format(
                        DATETIME_FORMATS.FULL
                      )}
                    >
                      {moment(repair?.createdAt).format(DATETIME_FORMATS.SHORT)}
                    </span>
                  </div>
                  <div
                    className={(classes["createdBy-wrapper"], classes["space"])}
                  >
                    <Tooltip title="Created by">
                      <FaRegUser />
                    </Tooltip>
                    <div className={classes["createdBy"]}>
                      {repair?.createdBy?.fullName}{" "}
                      {"(" + repair?.createdBy?.rcno + ")"}
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          key={repair.id}
        >
          <div className={classes["collapse-container"]}>
            <div className={classes["inner-info"]}></div>
            <div className={classes["flex"]}>
              <div className={classes["inner-block"]}>
                <span className={classes["inner-header"]}>Remarks</span>
                {remarkComments?.map((c: Comment) => (
                  <CommentCard
                    comment={c}
                    isRemark
                    key={c.id}
                    isDeleted={isDeleted}
                    mutation={REMOVE_REPAIR_COMMENT}
                    refetchQueries={[
                      "repairs",
                      "getAllHistoryOfEntity",
                      "breakdowns",
                    ]}
                  />
                ))}
              </div>
            </div>
            {observationComments?.map((c: Comment) => (
              <CommentCard
                comment={c}
                key={c.id}
                isDeleted={isDeleted}
                mutation={REMOVE_REPAIR_COMMENT}
                refetchQueries={[
                  "repairs",
                  "getAllHistoryOfEntity",
                  "breakdowns",
                ]}
              />
            ))}
            <div style={{ marginTop: 10 }}>
              {!isDeleted && (
                <AddRepairObservation
                  repairId={repair.id}
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

export default RepairCard;
