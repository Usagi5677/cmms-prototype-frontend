import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaRegClock,
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
  Divider,
} from "antd";
import { Link } from "react-router-dom";
import { Entity } from "../../../models/Entity/Entity";
import EntityStatusTag from "../../common/EntityStatusTag";
import { getListImage } from "../../../helpers/getListImage";
import { motion } from "framer-motion";
import EntityChecklistAndPMSummary from "../../../models/Entity/EntityChecklistAndPMSummary";
import { findIncompleteChecklistAndTasks } from "../../../helpers/findIncompleteChecklistAndTasks";
import { stringToColor } from "../../../helpers/style";
import { EntityIcon } from "../../common/EntityIcon";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import AssignSubEntity from "../AssignSubEntity/AssignSubEntity";
import { hasPermissions, isAssignedType } from "../../../helpers/permissions";

const EntityCard = ({
  entity,
  summaryData,
  smallView,
}: {
  entity: Entity;
  summaryData?: EntityChecklistAndPMSummary;
  smallView?: boolean;
}) => {
  const { user: self } = useContext(UserContext);
  const { Paragraph } = Typography;
  const interService =
    (entity.currentRunning ? entity.currentRunning : 0) -
    (entity.lastService ? entity.lastService : 0);

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
                <div
                  className={classes["first-block"]}
                  style={{ flex: smallView ? 2 : 1 }}
                >
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
                  <div
                    className={classes["inner-first-block"]}
                    style={{ flex: smallView ? 2 : 1 }}
                  >
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
                                color={"#87262c"}
                                text={"Some tasks not completed"}
                                status={"processing"}
                              />
                            </div>
                          }
                        >
                          <Badge color={"#87262c"} status={"processing"} />
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
                    {entity?.division && (
                      <div className={classes["reading"]}>
                        <span className={classes["reading-title"]}>
                          Division:
                        </span>
                        <span>{entity?.division?.name}</span>
                      </div>
                    )}
                  </div>
                  {!smallView ? (
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
                  ) : null}

                  <div className={classes["third-block"]}>
                    {entity?.status === "Breakdown" && entity?.breakdowns && (
                      <div className={classes["fourth-block"]}>
                        {entity?.breakdowns[0]?.estimatedDateOfRepair && (
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
                        )}
                      </div>
                    )}
                    <div>
                      <EntityStatusTag status={entity?.status} />
                    </div>
                  </div>
                </div>
                {hasPermissions(self, ["ADD_ENTITY"]) &&
                  entity?.parentEntityId && <AssignSubEntity entity={entity} />}

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

                  <span
                    className={classes["title"]}
                    title={moment(entity?.registeredDate).format(
                      DATETIME_FORMATS.FULL
                    )}
                  >
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
                  {smallView && (
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
                    Breakdown & Repair details:
                  </span>
                  {entity?.breakdowns?.length > 0 ? (
                    <div>
                      {entity?.breakdowns.map((b) => {
                        return (
                          <div key={b.id}>
                            <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                              <div className={classes["bd-time-wrapper"]}>
                                <div className={classes["title-wrapper"]}>
                                  <Tooltip title="Created Date">
                                    <FaRegClock />
                                  </Tooltip>

                                  <span
                                    className={classes["title"]}
                                    title={moment(b.createdAt).format(
                                      DATETIME_FORMATS.FULL
                                    )}
                                  >
                                    {moment(b.createdAt).format(
                                      DATETIME_FORMATS.DAY_MONTH_YEAR
                                    )}
                                  </span>
                                </div>
                                <span style={{ marginLeft: 4 }}>•</span>
                                <div className={classes["title-wrapper"]}>
                                  <span
                                    className={classes["title"]}
                                    title={moment(b.createdAt).format(
                                      DATETIME_FORMATS.FULL
                                    )}
                                  >
                                    {moment(b.createdAt).format(
                                      DATETIME_FORMATS.SHORT
                                    )}
                                  </span>
                                </div>
                              </div>
                            </Paragraph>
                            {b?.details?.map((d) => (
                              <div key={d.id}>
                                <div className={classes["list"]} key={d.id}>
                                  <span
                                    title={`Breakdown detail (${d.id})`}
                                    style={{
                                      color:
                                        b.type === "Breakdown"
                                          ? "red"
                                          : b.type === "Critical"
                                          ? "orange"
                                          : "var(--text-primary)",
                                    }}
                                  >
                                    {d.description}
                                  </span>
                                </div>
                                {d?.repairs?.map((r) => (
                                  <div
                                    className={classes["list-two"]}
                                    key={r.id}
                                  >
                                    <span
                                      style={{ color: "#52c41a" }}
                                      title={`Repair (${r.id}) of breakdown detail (${d.id})`}
                                    >
                                      {r.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ))}
                            {b?.repairs?.map((r) => {
                              //We are only showing breakdown's repair here. Not details
                              if (!r?.breakdownDetail?.id) {
                                return (
                                  <div className={classes["list"]} key={r.id}>
                                    <span
                                      style={{ color: "#52c41a" }}
                                      title={`Repair (${r.id}) of breakdown (${b.id})`}
                                    >
                                      {r.name}
                                    </span>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>None</div>
                  )}
                </div>
              </div>
              <div className={classes["container-second-row-first-block"]}>
                <div className={classes["reading"]}>
                  <span className={classes["reading-title"]}>
                    Spare PR details:
                  </span>
                  {entity?.sparePRs?.length > 0 ? (
                    <div>
                      {entity?.sparePRs?.map((s) => {
                        return (
                          <div key={s.id}>
                            <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                              <div className={classes["title-wrapper"]}></div>
                              <div className={classes["id-wrapper"]}>
                                <Tooltip title="Created Date">
                                  <FaRegClock style={{ opacity: 0.5 }} />
                                </Tooltip>

                                <span
                                  className={classes["title"]}
                                  title={moment(s.createdAt).format(
                                    DATETIME_FORMATS.FULL
                                  )}
                                  style={{ opacity: 0.5, paddingRight: 10 }}
                                >
                                  {moment(s.createdAt).format(
                                    DATETIME_FORMATS.DAY_MONTH_YEAR
                                  )}
                                </span>
                                <span title={`Spare PR (${s.id})`}>
                                  {s.name}
                                </span>
                              </div>
                            </Paragraph>
                            {s?.sparePRDetails?.map((d) => (
                              <div className={classes["list"]} key={d.id}>
                                <span
                                  title={`Spare PR Detail (${d.id}) of Spare PR (${s.id})`}
                                >
                                  {d.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>None</div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Repairs:</span>
                {entity?.repairs?.length > 0 ? (
                  <div>
                    {entity?.repairs.map((r) => {
                      return (
                        <div key={r.id}>
                          <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                            <div className={classes["id-wrapper"]}>
                              <Tooltip title="Created Date">
                                <FaRegClock style={{ opacity: 0.5 }} />
                              </Tooltip>

                              <span
                                style={{ opacity: 0.5, paddingRight: 10 }}
                                className={classes["title"]}
                                title={moment(r.createdAt).format(
                                  DATETIME_FORMATS.FULL
                                )}
                              >
                                {moment(r.createdAt).format(
                                  DATETIME_FORMATS.DAY_MONTH_YEAR
                                )}
                              </span>

                              <span title={`Repair (${r.id})`}>{r.name}</span>
                            </div>
                          </Paragraph>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>None</div>
                )}
              </div>
            </div>
            {entity?.subEntities?.length! > 0 && (
              <>
                <span
                  className={classes["reading-title"]}
                  style={{ marginTop: 20 }}
                >
                  Sub Entities
                </span>
                <Divider style={{ marginTop: 10 }} />
              </>
            )}

            {entity?.subEntities?.map((s) => (
              <EntityCard entity={s} key={s.id} />
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </motion.div>
  );
};

export default EntityCard;
