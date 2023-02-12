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
  Tag,
  Timeline,
  TimelineItemProps,
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
import { memo, useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import AssignSubEntity from "../AssignSubEntity/AssignSubEntity";
import { hasPermissions } from "../../../helpers/permissions";
import { useNavigate } from "react-router";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PMCardV2 from "../../common/PMCardV2/PMCardV2";
import { friendlyFormat } from "../../../helpers/friendlyFormat";
import SizeableTag from "../../common/SizeableTag/SizeableTag";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";

const EntityCard = ({
  entity,
  summaryData,
  smallView,
  includePM,
}: {
  entity: Entity;
  summaryData?: EntityChecklistAndPMSummary;
  smallView?: boolean;
  includePM?: PeriodicMaintenance[];
}) => {
  const { user: self } = useContext(UserContext);
  const isSmallDevice = useIsSmallDevice(600, true);
  const navigate = useNavigate();
  const { Paragraph } = Typography;
  const interService =
    (entity.currentRunning ? entity.currentRunning : 0) -
    (entity.lastService ? entity.lastService : 0);
  let fontColor = "#00e32a";
  let flag = false;
  if (entity?.type?.interServiceColor) {
    const exist = entity?.type?.interServiceColor.find((i) => {
      if (
        i.brand?.name === entity?.brand?.name &&
        i.type?.name === entity?.type?.name &&
        i.measurement === entity?.measurement
      ) {
        return i;
      }
    });
    if (
      interService >= exist?.lessThan! &&
      interService <= exist?.greaterThan!
    ) {
      fontColor = "orange";
      flag = true;
    } else if (interService >= exist?.greaterThan!) {
      fontColor = "red";
      flag = true;
    } else if (interService < 0) {
      fontColor = "var(--text-primary)";
    }
  }
  //test commit
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
                  className={classes["inner-block-wrapper"]}
                  style={{ flex: smallView ? 2 : 1 }}
                >
                  <div className={classes["first-block"]}>
                    {loading ? (
                      <Skeleton.Image
                        className={classes["image"]}
                        style={{
                          width: isSmallDevice ? 80 : 40,
                          height: isSmallDevice ? 70 : 30,
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      <Image
                        src={imagePath}
                        height={isSmallDevice ? 70 : 30}
                        width={isSmallDevice ? 80 : 40}
                        className={classes["image"]}
                        preview={false}
                        title={`${entity?.id}`}
                      />
                    )}
                    <div
                      className={classes["inner-first-block"]}
                      style={{ flex: smallView ? 2 : 2 }}
                    >
                      <div className={classes["inner-first-block-level-one"]}>
                        <span
                          className={classes["mn-title"]}
                          title={`Machine Number`}
                        >
                          {entity?.machineNumber}
                        </span>
                        {entity?.division && (
                          <SizeableTag
                            name={entity?.division?.name}
                            nameColor
                            fontSize={isSmallDevice ? 9 : 6}
                            height={isSmallDevice ? 14 : 10}
                            fontWeight={800}
                            title={"Division"}
                          />
                        )}
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
                      <span className={classes["inner-first-block-level-two"]}>
                        <div title={"Type"}>{entity?.type?.name}</div>
                        {entity?.model && (
                          <span className={classes["dot"]}>•</span>
                        )}
                        <div className={classes["model"]} title={"Model"}>
                          {entity?.model}
                        </div>
                        {entity?.brand?.name && (
                          <span className={classes["dot"]}>•</span>
                        )}
                        <div className={classes["brand"]} title={"Brand"}>
                          {entity?.brand?.name}
                        </div>
                        {entity?.engine && (
                          <span className={classes["dot"]}>•</span>
                        )}
                        <div className={classes["engine"]} title={"Engine"}>
                          {entity?.engine}
                        </div>
                      </span>
                      <div className={classes["inner-first-block-level-three"]}>
                        {entity?.registeredDate && (
                          <div title={"Registered Date"}>
                            {moment(entity?.registeredDate).format(
                              DATETIME_FORMATS.DAY_MONTH_YEAR
                            )}
                          </div>
                        )}
                        {entity?.location?.name && (
                          <span className={classes["dot"]}>•</span>
                        )}
                        <div title={"Location"}>{entity?.location?.name}</div>
                        {entity?.location?.zone?.name && (
                          <span className={classes["dot"]}>•</span>
                        )}
                        <div title={"Zone"}>{entity?.location?.zone?.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className={classes["second-block"]}>
                    <div className={classes["second-block-inner-block"]}>
                      {flag ? (
                        <span
                          className={classes["inter-reading"]}
                          style={{ color: fontColor, cursor: "pointer" }}
                          onClick={() =>
                            navigate(
                              `/entity/${entity.id}?tab=periodicMaintenance`
                            )
                          }
                          title={`Interservice: ${interService} (${entity?.measurement!})`}
                        >
                          {friendlyFormat(interService, 1)}
                          <div className={classes["measurement"]}>
                            {entity?.measurement}
                          </div>
                        </span>
                      ) : (
                        <span
                          className={classes["inter-reading"]}
                          style={{ color: fontColor }}
                          title={`Interservice: ${interService} (${entity?.measurement!})`}
                        >
                          {friendlyFormat(interService, 1)}

                          <div className={classes["measurement"]}>
                            {entity?.measurement}
                          </div>
                        </span>
                      )}
                      <div className={classes["status-block"]}>
                        {entity?.status === "Breakdown" && entity?.breakdowns && (
                          <div className={classes["estDateOfRepair-wrapper"]}>
                            {entity?.breakdowns[0]?.estimatedDateOfRepair && (
                              <span
                                className={classes["estDateOfRepair"]}
                                title={"Estimated Date of Repair"}
                              >
                                {moment(
                                  entity?.breakdowns[0]?.estimatedDateOfRepair
                                ).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
                              </span>
                            )}
                          </div>
                        )}
                        {isSmallDevice ? (
                          <EntityStatusTag
                            status={entity?.status}
                            noBorderRadius
                            title={
                              entity?.status === "Breakdown"
                                ? moment(
                                    entity?.breakdowns[0]?.createdAt
                                  ).format(DATETIME_FORMATS.FULL)
                                : entity?.status
                            }
                          />
                        ) : (
                          <SizeableTag
                            name={entity?.status}
                            defaultColor
                            fontSize={6}
                          />
                        )}
                      </div>
                    </div>

                    <div className={classes["second-block-action-btn-wrapper"]}>
                      {hasPermissions(self, ["ADD_ENTITY"]) &&
                        entity?.parentEntityId && (
                          <AssignSubEntity entity={entity} />
                        )}
                      <Link to={"/entity/" + entity.id}>
                        <Tooltip title="Open">
                          <FaArrowAltCircleRight
                            className={classes["button"]}
                          />
                        </Tooltip>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          key={entity.id}
        >
          <div className={classes["container"]}>
            <div className={classes["container-first-row"]}>
              <span
                className={classes["reading"]}
                style={{ color: fontColor }}
                title={`${interService}`}
              >
                {friendlyFormat(
                  entity?.currentRunning ? entity?.currentRunning : 0,
                  1
                )}

                <div className={classes["measurement"]}>
                  Current running ({entity?.measurement})
                </div>
              </span>
              <span
                className={classes["reading"]}
                style={{ color: fontColor }}
                title={`${entity?.lastService ? entity?.lastService : 0}`}
              >
                {friendlyFormat(
                  entity?.lastService ? entity?.lastService : 0,
                  1
                )}

                <div className={classes["measurement"]}>
                  Last service ({entity?.measurement})
                </div>
              </span>
            </div>
            <div className={classes["user-container"]}>
              <div className={classes["user-wrapper"]}>
                <span className={classes["user-title"]}>Admin</span>
                <Divider style={{ marginTop: 0, marginBottom: 10 }} />
                {assignedAdmin?.length! > 0 ? (
                  <Avatar.Group
                    maxCount={5}
                    maxStyle={{
                      color: "#f56a00",
                      backgroundColor: "#fde3cf",
                    }}
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
                                {assign?.user?.fullName} ({assign?.user?.rcno})
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
                <span className={classes["user-title"]}>Engineer</span>
                <Divider style={{ marginTop: 0, marginBottom: 10 }} />
                {assignedEngineer?.length! > 0 ? (
                  <Avatar.Group
                    maxCount={5}
                    maxStyle={{
                      color: "#f56a00",
                      backgroundColor: "#fde3cf",
                    }}
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
                                {assign?.user?.fullName} ({assign?.user?.rcno})
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
            <div className={classes["container-second-row"]}>
              <div className={classes["container-second-row-first-block"]}>
              <span className={classes["user-title"]}>
                    Breakdown & Repair
                  </span>
                  <Divider style={{ marginTop: 0, marginBottom: 10 }} />
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
              <div className={classes["container-second-row-first-block"]}>
              <span className={classes["user-title"]}>
                    Spare PR
                  </span>
                  <Divider style={{ marginTop: 0, marginBottom: 10 }} />
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
            {entity?.subEntities?.length! > 0 && (
              <>
                <span className={classes["user-title"]} style={{marginTop:20}}>
                    Sub Entities
                  </span>
                  <Divider style={{ marginTop: 0, marginBottom: 10 }} />
              </>
            )}
            <div style={{ marginLeft: 10 }}>
              {entity?.subEntities?.map((s) => (
                <EntityCard entity={s} key={s.id} />
              ))}
            </div>
            {includePM?.length! > 0 && (
              <>
                <span className={classes["user-title"]} style={{marginTop:20}}>
                    Maintenances
                  </span>
                  <Divider style={{ marginTop: 0, marginBottom: 10 }} />
              </>
            )}
            <div style={{ marginLeft: 10 }}>
              {includePM?.map((pm: PeriodicMaintenance) => (
                <PMCardV2
                  key={pm.id}
                  pm={pm}
                  currentRunning={entity?.currentRunning}
                  entityId={entity.id}
                />
              ))}
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </motion.div>
  );
};

export default memo(EntityCard);
