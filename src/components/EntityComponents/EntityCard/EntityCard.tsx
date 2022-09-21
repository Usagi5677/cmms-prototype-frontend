import {
  FaArrowAltCircleRight,
  FaGlobe,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaRegClock,
  FaTractor,
  FaTruck,
} from "react-icons/fa";

import classes from "./EntityCard.module.css";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import {
  Collapse,
  Tooltip,
  Image,
  Badge,
  Avatar,
  Typography,
  Skeleton,
} from "antd";
import { Link } from "react-router-dom";
import { Entity } from "../../../models/Entity/Entity";
import EntityStatusTag from "../../common/EntityStatusTag";
import { getListImage } from "../../../helpers/getListImage";
import { motion } from "framer-motion";
import EntityChecklistAndPMSummary from "../../../models/Entity/EntityChecklistAndPMSummary";
import { findIncompleteChecklistAndTasks } from "../../../helpers/findIncompleteChecklistAndTasks";
import { stringToColor } from "../../../helpers/style";
import { useState } from "react";
import { RiSailboatFill } from "react-icons/ri";
import { EntityIcon } from "../../common/EntityIcon";

const EntityCard = ({
  entity,
  summaryData,
}: {
  entity: Entity;
  summaryData?: EntityChecklistAndPMSummary;
}) => {
  const { Paragraph } = Typography;
  const interServiceMileage =
    (entity.currentMileage ?? 0) - (entity.lastServiceMileage ?? 0);
  const interService = (entity.currentRunning ?? 0) - (entity.lastService ?? 0);

  let fontColor = "#00e32a";
  if (entity?.type?.entityType === "Machine") {
    if (interService >= 500) {
      fontColor = "red";
    } else if (interService >= 400) {
      fontColor = "orange";
    }
  } else if (
    entity?.type?.entityType === "Vehicle" &&
    entity?.type?.name === "Double Decker" &&
    entity?.brand === "YUTONG"
  ) {
    if (interService >= 12000) {
      fontColor = "red";
    } else if (interService >= 10000) {
      fontColor = "orange";
    }
  } else if (
    entity?.type?.entityType === "Vehicle" &&
    entity?.type?.name === "Car" &&
    entity?.brand === "MAZDA"
  ) {
    if (interService >= 5000) {
      fontColor = "red";
    } else if (interService >= 3000) {
      fontColor = "orange";
    }
  } else {
    fontColor = "none";
  }

  let result = findIncompleteChecklistAndTasks(summaryData, entity?.id);

  let imagePath = getListImage(entity?.type?.name);

  let loading = true;
  if (imagePath) {
    loading = false;
  }
  let assignedEngineer = entity?.assignees?.filter(
    (assign) => assign.type === "Engineer"
  );
  let assignedAdmin = entity?.assignees?.filter(
    (assign) => assign.type === "Admin"
  );

  return (
    <motion.div
      id="collapse"
      initial={{ x: -20, opacity: 0 }}
      whileInView={{
        x: 0,
        opacity: 1,
        transition: {
          ease: "easeOut",
          duration: 0.3,
          delay: 0.1,
        },
      }}
      viewport={{ once: true }}
    >
      <Collapse ghost style={{ marginBottom: ".5rem" }}>
        <Collapse.Panel
          header={
            <>
              <div className={classes["header-container"]}>
                <div className={classes["first-block"]}>
                  {loading ? (
                    <Skeleton.Image
                      style={{ width: 60, height: 50, borderRadius: 6 }}
                    />
                  ) : (
                    <Image
                      src={imagePath}
                      height={50}
                      width={60}
                      preview={false}
                    />
                  )}
                  <div className={classes["inner-first-block"]}>
                    <div className={classes["title-wrapper"]}>
                      <EntityIcon entityType={entity?.type?.entityType} />
                      <span className={classes["mn-title"]}>
                        {entity?.machineNumber}
                      </span>
                      {result[0] && (
                        <Tooltip
                          color="var(--dot-tooltip)"
                          title={
                            <div>
                              <Badge
                                color={"red"}
                                text={"Some tasks not completed"}
                                status={"processing"}
                              />
                            </div>
                          }
                        >
                          <Badge color={"red"} status={"processing"} />
                        </Tooltip>
                      )}
                      {result[1] && (
                        <Tooltip
                          color="var(--dot-tooltip)"
                          title={
                            <div>
                              <Badge
                                color={"red"}
                                text={"Some checklists not completed"}
                                status={"processing"}
                              />
                            </div>
                          }
                        >
                          <Badge color={"red"} status={"processing"} />
                        </Tooltip>
                      )}
                    </div>
                    <div className={classes["location-wrapper"]}>
                      <FaMapMarkerAlt />
                      <span className={classes["title"]}>
                        {entity?.location?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={classes["second-block"]}>
                  <div className={classes["inner-second-block"]}>
                    <div className={classes["reading"]}>
                      <span className={classes["reading-title"]}>Type:</span>
                      <span>{entity?.type?.name}</span>
                    </div>
                    {entity?.department && (
                      <div className={classes["reading"]}>
                        <span className={classes["reading-title"]}>
                          Department:
                        </span>
                        <span>{entity?.department}</span>
                      </div>
                    )}
                  </div>
                  <div className={classes["service-reading-wrapper"]}>
                    <div
                      className={classes["reading"]}
                      style={{
                        border: `1px solid ${fontColor}`,
                        borderRadius: 10,
                        padding: 5,
                      }}
                    >
                      <span className={classes["reading-title"]}>
                        Inter service ({entity?.measurement}):
                      </span>
                      <span
                        className={classes["inter-reading"]}
                        style={{ color: fontColor }}
                      >
                        {interService}
                      </span>
                    </div>
                  </div>
                  <div className={classes["third-block"]}>
                    <EntityStatusTag status={entity?.status} />
                  </div>
                  {entity?.breakdowns[0]?.estimatedDateOfRepair &&
                    entity?.status === "Breakdown" && (
                      <div className={classes["fourth-block"]}>
                        <div className={classes["title-wrapper"]}>
                          <Tooltip title="Estimated date of repair">
                            <FaRegClock />
                          </Tooltip>
                          <span
                            className={classes["title"]}
                            title={moment(
                              entity?.breakdowns[0]?.estimatedDateOfRepair
                            ).format(DATETIME_FORMATS.FULL)}
                          >
                            {moment(
                              entity?.breakdowns[0]?.estimatedDateOfRepair
                            ).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                <Link to={"/entity/" + entity.id}>
                  <Tooltip title="Open">
                    <FaArrowAltCircleRight className={classes["button"]} />
                  </Tooltip>
                </Link>
              </div>
            </>
          }
          key={entity.id}
        >
          <div className={classes["container"]}>
            <div className={classes["container-first-row"]}>
              <div className={classes["container-first-block"]}>
                <div className={classes["title-wrapper"]}>
                  <Tooltip title="Registered Date">
                    <FaRegClock />
                  </Tooltip>

                  <span className={classes["title"]}>
                    {moment(entity?.registeredDate).format(
                      DATETIME_FORMATS.DAY_MONTH_YEAR
                    )}
                  </span>
                </div>
                <div className={classes["reading"]}>
                  <span className={classes["reading-title"]}>Zone:</span>
                  <span>
                    {entity?.location?.zone?.name
                      ? entity?.location?.zone?.name
                      : "None"}
                  </span>
                </div>
                <div className={classes["reading"]}>
                  <span className={classes["reading-title"]}>Model:</span>
                  <span>{entity?.model ? entity?.model : "None"}</span>
                </div>
                <div className={classes["reading"]}>
                  <span className={classes["reading-title"]}>Brand:</span>
                  <span>{entity?.brand ? entity?.brand : "None"}</span>
                </div>
                <div className={classes["reading"]}>
                  <span className={classes["reading-title"]}>Engine:</span>
                  <span>{entity?.engine ? entity?.engine : "None"}</span>
                </div>
              </div>
              <div className={classes["container-second-block-wrapper"]}>
                <div className={classes["container-second-block"]}>
                  {entity?.currentRunning! >= 0 && (
                    <div className={classes["reading"]}>
                      <span className={classes["reading-title"]}>
                        Current running ({entity?.measurement}):
                      </span>
                      <span>
                        {entity?.currentRunning ? entity?.currentRunning : 0}
                      </span>
                    </div>
                  )}
                  {entity?.lastService! >= 0 && (
                    <div className={classes["reading"]}>
                      <span className={classes["reading-title"]}>
                        Last service ({entity?.measurement}):
                      </span>
                      <span>
                        {entity?.lastService ? entity?.lastService : 0}
                      </span>
                    </div>
                  )}
                </div>
                <div className={classes["container-third-block"]}>
                  <div className={classes["user-wrapper"]}>
                    <span className={classes["reading-title"]}>Admin:</span>
                    {assignedAdmin?.length! > 0 ? (
                      <Avatar.Group
                        maxCount={5}
                        maxStyle={{
                          color: "#f56a00",
                          backgroundColor: "#fde3cf",
                        }}
                        size={"small"}
                      >
                        {assignedAdmin?.map((assign) => {
                          return (
                            <Tooltip
                              title={
                                <>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {assign?.user?.fullName} (
                                    {assign?.user?.rcno})
                                  </div>
                                </>
                              }
                              placement="bottom"
                              key={assign?.user?.id}
                            >
                              <Avatar
                                style={{
                                  backgroundColor: stringToColor(
                                    assign?.user?.fullName!
                                  ),
                                }}
                                size={"small"}
                              >
                                {assign?.user?.fullName
                                  .match(/^\w|\b\w(?=\S+$)/g)
                                  ?.join()
                                  .replace(",", "")
                                  .toUpperCase()}
                              </Avatar>
                            </Tooltip>
                          );
                        })}
                      </Avatar.Group>
                    ) : (
                      <div>None</div>
                    )}
                  </div>
                  <div className={classes["user-wrapper"]}>
                    <span className={classes["reading-title"]}>Engineer:</span>
                    {assignedEngineer?.length! > 0 ? (
                      <Avatar.Group
                        maxCount={5}
                        maxStyle={{
                          color: "#f56a00",
                          backgroundColor: "#fde3cf",
                        }}
                        size={"small"}
                      >
                        {assignedEngineer?.map((assign) => {
                          return (
                            <Tooltip
                              title={
                                <>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {assign?.user?.fullName} (
                                    {assign?.user?.rcno})
                                  </div>
                                </>
                              }
                              placement="bottom"
                              key={assign?.user?.id}
                            >
                              <Avatar
                                style={{
                                  backgroundColor: stringToColor(
                                    assign?.user?.fullName!
                                  ),
                                }}
                                size={"small"}
                              >
                                {assign?.user?.fullName
                                  .match(/^\w|\b\w(?=\S+$)/g)
                                  ?.join()
                                  .replace(",", "")
                                  .toUpperCase()}
                              </Avatar>
                            </Tooltip>
                          );
                        })}
                      </Avatar.Group>
                    ) : (
                      <div>None</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={classes["container-second-row"]}>
              <div className={classes["container-second-row-first-block"]}>
                <div className={classes["reading"]}>
                  <span className={classes["reading-title"]}>
                    Breakdown details:
                  </span>
                  <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                    {entity?.breakdowns[0]?.name &&
                    entity?.status === "Breakdown"
                      ? entity?.breakdowns[0]?.name
                      : "None"}
                  </Paragraph>
                </div>
              </div>
              <div className={classes["container-second-row-first-block"]}>
                <div className={classes["reading"]}>
                  <span className={classes["reading-title"]}>
                    Spare PR details:
                  </span>
                  <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                    {entity?.sparePRs[0]?.name
                      ? entity?.sparePRs[0]?.name
                      : "None"}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </motion.div>
  );
};

export default EntityCard;
