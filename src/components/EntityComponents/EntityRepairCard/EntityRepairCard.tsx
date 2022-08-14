import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Checkbox, Collapse, Spin, Tag, Tooltip, Typography } from "antd";

import moment from "moment";
import { useContext, useState } from "react";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import {
  TOGGLE_APPROVE_ENTITY_REPAIR_REQUEST,
  TOGGLE_COMPLETE_ENTITY_REPAIR_REQUEST,
} from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import EntityRepairRequest from "../../../models/Entity/EntityRepairRequest";
import User from "../../../models/User";
import DeleteEntityRepairRequest from "../DeleteEntityRepairRequest/DeleteEntityRepairRequest";
import EditEntityRepairRequest from "../EditEntityRepairRequest/EditEntityRepairRequest";
import classes from "./EntityRepairCard.module.css";

const EntityRepairCard = ({
  repair,
  isDeleted,
  userData,
}: {
  repair: EntityRepairRequest;
  isDeleted?: boolean | undefined;
  userData?: User[];
}) => {
  const { user: self } = useContext(UserContext);
  const { Paragraph } = Typography;
  const [toggleApproval, { loading: toggling }] = useMutation(
    TOGGLE_APPROVE_ENTITY_REPAIR_REQUEST,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating approval.");
      },
      refetchQueries: [
        "getSingleEntity",
        "getAllHistoryOfEntity",
        "getAllRepairRequestOfEntity",
      ],
    }
  );
  const [toggleComplete, { loading: togglingTwo }] = useMutation(
    TOGGLE_COMPLETE_ENTITY_REPAIR_REQUEST,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating complete.");
      },
      refetchQueries: [
        "getSingleEntity",
        "getAllHistoryOfEntity",
        "getAllRepairRequestOfEntity",
      ],
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
                onClick={(event) => event.stopPropagation()}
              >
                <div className={classes["first-block"]}>
                  <div className={classes["id-wrapper"]}>
                    <ToolOutlined className={classes["icon"]} />
                    <span className={classes["title"]}>{repair?.id}</span>
                  </div>
                  <div className={classes["title-wrapper"]}>
                    <Tooltip title="Requested Date">
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
                </div>
                <div className={classes["second-block"]}>
                  <div className={classes["requestedBy-wrapper"]}>
                    <Tooltip title="Requested by">
                      <FaRegUser />
                    </Tooltip>
                    <div className={classes["requestedBy"]}>
                      {repair?.requestedBy?.fullName}{" "}
                      {"(" + repair?.requestedBy?.rcno + ")"}
                    </div>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Project Name:
                    </span>
                    <span>
                      {repair?.projectName ? repair?.projectName : "None"}
                    </span>
                  </div>
                </div>
                <div className={classes["third-block"]}>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>Reason:</span>
                    <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                      {repair?.reason ? repair?.reason : "None"}
                    </Paragraph>
                  </div>
                </div>
                <div className={classes["block-wrapper"]}>
                  <div className={classes["fourth-block"]}>
                    <div className={classes["tag-wrapper"]}>
                      <Tag
                        icon={
                          togglingTwo ? (
                            <SyncOutlined spin />
                          ) : repair?.repairedAt ? (
                            <CheckCircleOutlined />
                          ) : (
                            <ClockCircleOutlined />
                          )
                        }
                        color={repair?.repairedAt ? "success" : ""}
                        onClick={() => {
                          let flag = !repair?.repairedAt;
                          toggleComplete({
                            variables: {
                              id: repair.id,
                              complete: flag,
                            },
                          });
                        }}
                        style={{
                          pointerEvents: self.assignedPermission
                            ?.hasEntityRepairRequestEdit
                            ? "initial"
                            : "none",
                        }}
                      >
                        {repair?.repairedAt ? "Completed" : "Incomplete"}
                      </Tag>
                    </div>
                    <Tag
                      icon={
                        toggling ? (
                          <SyncOutlined spin />
                        ) : repair?.approvedAt ? (
                          <CheckCircleOutlined />
                        ) : (
                          <ClockCircleOutlined />
                        )
                      }
                      color={repair?.approvedAt ? "success" : ""}
                      onClick={() => {
                        let flag = !repair?.approvedAt;
                        toggleApproval({
                          variables: {
                            id: repair.id,
                            approve: flag,
                          },
                        });
                      }}
                      style={{
                        pointerEvents: self.assignedPermission
                          ?.hasEntityRepairRequestEdit
                          ? "initial"
                          : "none",
                      }}
                    >
                      {repair?.approvedAt ? "Approved" : "Approving"}
                    </Tag>
                  </div>
                  <div className={classes["fifth-block"]}>
                    <EditEntityRepairRequest
                      repair={repair}
                      userData={userData}
                    />
                    <DeleteEntityRepairRequest id={repair.id} />
                  </div>
                </div>
              </div>
            </>
          }
          key={repair.id}
        >
          <div className={classes["collapse-container"]}>
            <div className={classes["inner-info"]}>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Operator:</span>
                {repair?.operator ? (
                  <span>
                    {repair?.operator?.fullName}{" "}
                    {"(" + repair?.operator?.rcno + ")"}
                  </span>
                ) : (
                  "None"
                )}
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Supervisor:</span>
                {repair?.supervisor ? (
                  <span>
                    {repair?.supervisor?.fullName}{" "}
                    {"(" + repair?.supervisor?.rcno + ")"}
                  </span>
                ) : (
                  "None"
                )}
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>
                  Project Manager:
                </span>
                {repair?.projectManager ? (
                  <span>
                    {repair?.projectManager?.fullName}{" "}
                    {"(" + repair?.projectManager?.rcno + ")"}
                  </span>
                ) : (
                  "None"
                )}
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Location:</span>
                {repair?.location ? <span>{repair?.location}</span> : "None"}
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Approver:</span>
                {repair?.approvedBy ? (
                  <span>
                    {repair?.approvedBy?.fullName}{" "}
                    {"(" + repair?.approvedBy?.rcno + ")"}
                  </span>
                ) : (
                  "None"
                )}
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Approved Date:</span>
                {repair?.approvedAt ? (
                  <span
                    className={classes["title"]}
                    title={moment(repair?.approvedAt).format(
                      DATETIME_FORMATS.FULL
                    )}
                  >
                    {moment(repair?.approvedAt).format(DATETIME_FORMATS.SHORT)}
                  </span>
                ) : (
                  "None"
                )}
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Repairer:</span>
                {repair?.repairedBy ? (
                  <span>
                    {repair?.repairedBy?.fullName}{" "}
                    {"(" + repair?.repairedBy?.rcno + ")"}
                  </span>
                ) : (
                  "None"
                )}
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Repaired Date:</span>
                {repair?.repairedAt ? (
                  <span
                    className={classes["title"]}
                    title={moment(repair?.repairedAt).format(
                      DATETIME_FORMATS.FULL
                    )}
                  >
                    {moment(repair?.repairedAt).format(DATETIME_FORMATS.SHORT)}
                  </span>
                ) : (
                  "None"
                )}
              </div>
            </div>
            <div className={classes["flex"]}>
              <div className={classes["inner-block"]}>
                <div className={classes["reading"]}>
                  <span className={classes["reading-title"]}>
                    Additional Information:
                  </span>
                  <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                    {repair?.additionalInfo ? repair?.additionalInfo : "None"}
                  </Paragraph>
                </div>
              </div>
              <div className={classes["inner-block"]}>
                <div className={classes["title-wrapper"]}>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Attend Information:
                    </span>
                    <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                      {repair?.attendInfo ? repair?.additionalInfo : "None"}
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default EntityRepairCard;
