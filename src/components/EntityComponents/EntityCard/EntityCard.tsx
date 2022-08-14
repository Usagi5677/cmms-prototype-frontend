import {
  FaArrowAltCircleRight,
  FaGlobe,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaRegClock,
  FaTractor,
} from "react-icons/fa";

import classes from "./EntityCard.module.css";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { Collapse, Tooltip, Image } from "antd";
import { Link } from "react-router-dom";
import { Entity } from "../../../models/Entity/Entity";
import EntityStatusTag from "../../common/EntityStatusTag";
import { getListImage } from "../../../helpers/getListImage";

const EntityCard = ({ entity }: { entity: Entity }) => {
  const interServiceMileage =
    (entity.currentMileage ?? 0) - (entity.lastServiceMileage ?? 0);
  const interService = (entity.currentRunning ?? 0) - (entity.lastService ?? 0);

  return (
    <div id="collapse">
      <Collapse ghost style={{ marginBottom: ".5rem" }}>
        <Collapse.Panel
          header={
            <>
              <div
                className={classes["header-container"]}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={classes["first-block"]}>
                  {getListImage(entity?.type?.name) && (
                    <Image
                      src={getListImage(entity?.type?.name)}
                      height={50}
                      width={60}
                      preview={false}
                    />
                  )}
                  <div className={classes["inner-first-block"]}>
                    <div className={classes["title-wrapper"]}>
                      <FaTractor />
                      <span className={classes["title"]}>
                        {entity?.machineNumber}
                      </span>
                    </div>
                    <div className={classes["location-wrapper"]}>
                      <FaMapMarkerAlt />
                      <span className={classes["title"]}>
                        {entity?.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={classes["service-reading-wrapper"]}>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Current running ({entity?.measurement}):
                    </span>
                    <span>
                      {entity?.currentRunning ? entity?.currentRunning : 0}
                    </span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Last service ({entity?.measurement}):
                    </span>
                    <span>{entity?.lastService ? entity?.lastService : 0}</span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Inter service ({entity?.measurement}):
                    </span>
                    <span>{interService}</span>
                  </div>
                  <div className={classes["status"]}>
                    <EntityStatusTag status={entity?.status} />
                  </div>
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
            <div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>
                  Current mileage ({entity?.measurement}):
                </span>
                <span>
                  {entity?.currentMileage ? entity?.currentMileage : 0}
                </span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>
                  Last service mileage ({entity?.measurement}):
                </span>
                <span>
                  {entity?.lastServiceMileage ? entity?.lastServiceMileage : 0}
                </span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>
                  Inter service mileage ({entity?.measurement}):
                </span>
                <span>{interServiceMileage}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Model:</span>
                <span>{entity?.model}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Type:</span>
                <span>{entity?.type?.name}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Engine:</span>
                <span>{entity?.engine}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Department:</span>
                <span>{entity?.department}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Brand:</span>
                <span>{entity?.brand}</span>
              </div>
            </div>

            <div>
              <div className={classes["title-wrapper"]}>
                <span>Spare PR details:</span>
                <Tooltip
                  title={
                    <>
                      {"Requested Date: "}
                      {entity?.sparePRs[0]?.requestedDate
                        ? moment(entity?.sparePRs[0]?.requestedDate).format(
                            DATETIME_FORMATS.DAY_MONTH_YEAR
                          )
                        : null}
                      <br />
                      {"Title: "}
                      {entity?.sparePRs[0]?.title}
                      <br />
                      {"Description: "}
                      {entity?.sparePRs[0]?.description}
                      <br />
                      {"Status: "}
                      {entity?.sparePRs[0]?.status}
                    </>
                  }
                >
                  <FaQuestionCircle style={{ marginLeft: 5 }} />
                </Tooltip>
              </div>
              {entity?.breakdowns[0] && (
                <div className={classes["title-wrapper"]}>
                  <span>Breakdown details:</span>
                  <Tooltip
                    title={
                      <>
                        {"Title: "}
                        {entity?.breakdowns[0]?.title}
                        <br />
                        {"Description: "}
                        {entity?.breakdowns[0]?.description}
                        <br />
                        {"Status: "}
                        {entity?.breakdowns[0]?.status}
                      </>
                    }
                  >
                    <FaQuestionCircle style={{ marginLeft: 5 }} />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default EntityCard;
