import { CommentOutlined, ToolOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Collapse, Tooltip } from "antd";
import moment from "moment";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import { REMOVE_REPAIR_COMMENT } from "../../../api/mutations";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import Repair from "../../../models/Entity/Repair";
import { CommentCard } from "../../common/CommentCard/CommentCard";
import DeleteRepair from "../DeleteRepair/DeleteRepair";
import EditRepair from "../EditRepair/EditRepair";
import classes from "./RepairCard.module.css";
import Comment from "../../../models/Comment";
import { AddRepairComment } from "../AddRepairComment";
import { AddRepairObservation } from "../../common/AddRepairObservation";
import { hasPermissions } from "../../../helpers/permissions";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";

const RepairCard = ({
  repair,
  isDeleted,
}: {
  repair: Repair;
  isDeleted?: boolean;
}) => {
  const { user: self } = useContext(UserContext);
  const remarkComments = repair?.comments?.filter(
    (c: Comment) => c.type === "Remark"
  );
  const observationComments = repair?.comments?.filter(
    (c: Comment) => c.type === "Observation"
  );
  const visible = repair?.breakdown;

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
                <div className={classes["info-wrapper"]}>
                  <div className={classes["first-block"]}>
                    <div className={classes["id-wrapper"]}>
                      <ToolOutlined className={classes["icon"]} />
                      <span className={classes["title"]}>{repair?.id}</span>
                      {repair?.comments?.length! > 0 ? (
                        <CommentOutlined
                          style={{
                            marginLeft: 20,
                          }}
                        />
                      ) : null}
                    </div>
                    <div className={classes["title-wrapper"]}>
                      <Tooltip title="Created Date">
                        <FaRegClock className={classes["icon"]} />
                      </Tooltip>

                      <span
                        className={classes["title"]}
                        title={moment(repair?.createdAt).format(
                          DATETIME_FORMATS.FULL
                        )}
                      >
                        {moment(repair?.createdAt).format(
                          DATETIME_FORMATS.SHORT
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={classes["second-block"]}>
                    <div className={classes["createdBy-wrapper"]}>
                      <Tooltip title="Created by">
                        <FaRegUser style={{ opacity: 0.5 }} />
                      </Tooltip>
                      <div className={classes["createdBy"]}>
                        {repair?.createdBy?.fullName}{" "}
                        {"(" + repair?.createdBy?.rcno + ")"}
                      </div>
                    </div>
                    <div className={classes["reading"]}>
                      <span className={classes["reading-title"]}>Name:</span>
                      {repair?.name}
                    </div>
                  </div>
                  <div
                    className={classes["third-block"]}
                    style={{
                      visibility: visible ? "visible" : "hidden",
                    }}
                  >
                    <div className={classes["reading"]}>
                      <span className={classes["reading-title"]}>
                        Breakdown Type:
                      </span>
                      {repair?.breakdown?.type}
                    </div>
                    <div className={classes["reading"]}>
                      <span className={classes["reading-title"]}>
                        Breakdown Name:
                      </span>
                      ({repair?.breakdown?.id}) {repair?.breakdown?.name}
                    </div>
                  </div>
                </div>
                <div className={classes["fifth-block"]}>
                  <div style={{ marginRight: 8, marginTop: 4 }}>
                    {hasPermissions(self, ["MODIFY_REPAIR_REQUEST"]) ? (
                      <AddRepairComment repair={repair} isDeleted={isDeleted} />
                    ) : null}
                  </div>
                  {hasPermissions(self, ["MODIFY_REPAIR_REQUEST"]) ? (
                    <EditRepair repair={repair} isDeleted={isDeleted} />
                  ) : null}
                  {hasPermissions(self, ["MODIFY_REPAIR_REQUEST"]) ? (
                    <DeleteRepair id={repair.id} isDeleted={isDeleted} />
                  ) : null}
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
            {hasPermissions(self, ["MODIFY_REPAIR_REQUEST"]) ? (
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
            ) : null}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default RepairCard;
