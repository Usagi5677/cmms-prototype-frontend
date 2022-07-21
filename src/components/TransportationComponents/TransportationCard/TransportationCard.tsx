import {
  FaArrowAltCircleRight,
  FaGlobe,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaRegClock,
  FaTractor,
} from "react-icons/fa";
import TransportationStatusTag from "../../common/TransportationStatusTag";
import classes from "./TransportationCard.module.css";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { Collapse, Tooltip } from "antd";
import Transportation from "../../../models/Transportation";
import { Link } from "react-router-dom";

const TransportationCard = ({
  transportation,
}: {
  transportation: Transportation;
}) => {
  let borderLeft: string;
  let border: string;
  const interService =
    (transportation.currentMileage ?? 0) -
    (transportation.lastServiceMileage ?? 0);
  if (interService! >= 500) {
    borderLeft = "8px solid red";
    border = "2px solid red";
  } else if (interService! >= 400) {
    borderLeft = "8px solid orange";
    border = "2px solid orange";
  } else {
    borderLeft = "8px solid #39e95c";
    border = "2px solid #39e95c";
  }

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
                  <div className={classes["title-wrapper"]}>
                    <FaTractor />
                    <span className={classes["title"]}>
                      {transportation?.machineNumber}
                    </span>
                  </div>
                  <div className={classes["location-wrapper"]}>
                    <FaMapMarkerAlt />
                    <span className={classes["title"]}>
                      {transportation?.location}
                    </span>
                  </div>
                </div>

                <div className={classes["service-reading-wrapper"]}>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Current mileage ({transportation?.measurement}):
                    </span>
                    <span>{transportation?.currentMileage}</span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Last service mileage ({transportation?.measurement}):
                    </span>
                    <span>{transportation?.lastServiceMileage}</span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Inter service mileage ({transportation?.measurement}):
                    </span>
                    <span>{interService}</span>
                  </div>
                  <div className={classes["status"]}>
                    <TransportationStatusTag status={transportation?.status} />
                  </div>
                </div>
                <Link to={"/transportation/" + transportation.id}>
                  <Tooltip title="Open">
                    <FaArrowAltCircleRight className={classes["button"]} />
                  </Tooltip>
                </Link>
              </div>
            </>
          }
          key={transportation.id}
        >
          <div className={classes["container"]}>
            <div className={classes["title-wrapper"]}>
              <Tooltip title="Registered Date">
                <FaRegClock />
              </Tooltip>

              <span className={classes["title"]}>
                {moment(transportation?.registeredDate).format(
                  DATETIME_FORMATS.DAY_MONTH_YEAR
                )}
              </span>
            </div>
            <div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Model:</span>
                <span>{transportation?.model}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Type:</span>
                <span>{transportation?.type}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Engine:</span>
                <span>{transportation?.engine}</span>
              </div>
            </div>

            <div>
              <div className={classes["title-wrapper"]}>
                <span>Spare PR details:</span>
                <Tooltip
                  title={
                    <>
                      {"Requested Date: "}
                      {transportation?.sparePRs[0]?.requestedDate
                        ? moment(
                            transportation?.sparePRs[0]?.requestedDate
                          ).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
                        : null}
                      <br />
                      {"Title: "}
                      {transportation?.sparePRs[0]?.title}
                      <br />
                      {"Description: "}
                      {transportation?.sparePRs[0]?.description}
                      <br />
                      {"Status: "}
                      {transportation?.sparePRs[0]?.status}
                    </>
                  }
                >
                  <FaQuestionCircle style={{ marginLeft: 5 }} />
                </Tooltip>
              </div>
              {transportation?.breakdowns[0] && (
                <div className={classes["title-wrapper"]}>
                  <span>Breakdown details:</span>
                  <Tooltip
                    title={
                      <>
                        {"Title: "}
                        {transportation?.breakdowns[0]?.title}
                        <br />
                        {"Description: "}
                        {transportation?.breakdowns[0]?.description}
                        <br />
                        {"Status: "}
                        {transportation?.breakdowns[0]?.status}
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

export default TransportationCard;
