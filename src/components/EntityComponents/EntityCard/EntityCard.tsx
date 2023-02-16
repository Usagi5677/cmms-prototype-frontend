import { FaArrowAltCircleRight, FaRegCircle } from "react-icons/fa";
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
import { memo, useContext, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import AssignSubEntity from "../AssignSubEntity/AssignSubEntity";
import { hasPermissions } from "../../../helpers/permissions";
import { useNavigate } from "react-router";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PMCardV2 from "../../common/PMCardV2/PMCardV2";
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
  const [isOpen, setIsOpen] = useState(false);
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
              <div
                className={classes["header-container"]}
                onClick={() => setIsOpen(!isOpen)}
              >
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
                            <Badge style={{marginLeft: 6}} color={"#87262c"} status={"processing"} />
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
                            <Badge style={{marginLeft: 6}} color={"red"} status={"processing"} />
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
                        {entity?.registeredDate && (
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
                          title={`Interservice`}
                        >
                          {interService.toLocaleString()}
                          <div className={classes["measurement"]}>
                            {entity?.measurement}
                          </div>
                        </span>
                      ) : (
                        <span
                          className={classes["inter-reading"]}
                          style={{ color: fontColor }}
                          title={`Interservice`}
                        >
                          {interService.toLocaleString()}

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
                            style={{
                              rotate: isOpen ? "90deg" : "0deg",
                              transition: "rotate 0.3s ease",
                            }}
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
                title={`Current Running`}
              >
                {entity?.currentRunning ? entity?.currentRunning.toLocaleString() : 0}

                <div className={classes["measurement"]}>
                  Current running ({entity?.measurement})
                </div>
              </span>
              <span
                className={classes["reading"]}
                style={{ color: fontColor }}
                title={`Last Service`}
              >
                {entity?.lastService ? entity?.lastService.toLocaleString() : 0}

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
              <Divider
                type="vertical"
                style={{ height: 18 }}
                className={classes["min-seperator"]}
              />
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
                          </Paragraph>

                          {b?.details?.map((d) => (
                            <div
                              key={d.id}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <FaRegCircle
                                style={{
                                  marginRight: 6,
                                  marginLeft: 8,
                                  fontSize: 9,
                                  color:
                                    b.type === "Breakdown"
                                      ? "red"
                                      : b.type === "Critical"
                                      ? "orange"
                                      : "var(--text-primary)",
                                }}
                              />
                              <span title={`Breakdown detail (${d.id})`}>
                                {d.description}
                              </span>
                              {d?.repairs?.map((r) => (
                                <div
                                  key={r.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <FaRegCircle
                                    style={{
                                      marginRight: 6,
                                      marginLeft: 8,
                                      fontSize: 9,
                                      color: "#52c41a",
                                    }}
                                  />
                                  <span
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
                                <div
                                  key={r.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <FaRegCircle
                                    style={{
                                      marginRight: 6,
                                      marginLeft: 8,
                                      fontSize: 9,
                                      color: "#52c41a",
                                    }}
                                  />
                                  <span
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
              <Divider
                type="vertical"
                style={{ height: 24 }}
                className={classes["seperator"]}
              />
              <div className={classes["container-second-row-first-block"]}>
                <span className={classes["user-title"]}>Spare PR</span>
                <Divider style={{ marginTop: 0, marginBottom: 10 }} />
                {entity?.sparePRs?.length > 0 ? (
                  <div>
                    {entity?.sparePRs?.map((s) => {
                      return (
                        <div key={s.id}>
                          <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                            <div className={classes["id-wrapper"]}>
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
                              <span title={`Spare PR (${s.id})`}>{s.name}</span>
                            </div>
                          </Paragraph>
                          {s?.sparePRDetails?.map((d) => (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                              key={d.id}
                            >
                              <FaRegCircle
                                style={{
                                  marginRight: 6,
                                  marginLeft: 8,
                                  fontSize: 9,
                                }}
                              />
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
                <span
                  className={classes["user-title"]}
                  style={{ marginTop: 20 }}
                >
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
                <span
                  className={classes["user-title"]}
                  style={{ marginTop: 20 }}
                >
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
