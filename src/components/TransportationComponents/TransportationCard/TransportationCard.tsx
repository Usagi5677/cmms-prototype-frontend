import {
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
import { Tooltip } from "antd";
import Transportation from "../../../models/Transportation";

const TransportationCard = ({
  transportation,
}: {
  transportation: Transportation;
}) => {
  let borderLeft: string;
  let border: string;
  if (transportation?.interServiceMileage! >= 500) {
    borderLeft = "8px solid red";
    border = "2px solid red";
  } else if (transportation?.interServiceMileage! >= 400) {
    borderLeft = "8px solid orange";
    border = "2px solid orange";
  } else {
    borderLeft = "8px solid #39e95c";
    border = "2px solid #39e95c";
  }

  return (
    <div
      className={classes["container"]}
      style={{
        borderTop: border,
        borderRight: border,
        borderBottom: border,
        borderLeft: borderLeft,
      }}
    >
      <div className={classes["first-wrapper"]}>
        <div className={classes["first-block"]}>
          <div className={classes["title-wrapper"]}>
            <FaTractor />
            <span className={classes["title"]}>
              {transportation?.machineNumber}
            </span>
          </div>
          <div className={classes["title-wrapper"]}>
            <FaMapMarkerAlt />
            <span className={classes["title"]}>{transportation?.location}</span>
            <span className={classes["dash"]}>-</span>
            <span>{transportation?.department}</span>
          </div>
          <div className={classes["title-wrapper"]}>
            <FaRegClock />
            <span className={classes["title"]}>
              {moment(transportation?.registeredDate).format(
                DATETIME_FORMATS.DAY_MONTH_YEAR
              )}
            </span>
          </div>
        </div>
        <div className={classes["second-block"]}>
          <div>
            <span>Model:</span>
            <span className={classes["title"]}>{transportation?.model}</span>
          </div>
          <div>
            <span>Type:</span>
            <span className={classes["title"]}>{transportation?.type}</span>
          </div>
          <div>
            <span>Engine:</span>
            <span className={classes["title"]}>{transportation?.engine}</span>
          </div>
        </div>
      </div>

      <div className={classes["second-wrapper"]}>
        <div className={classes["third-block"]}>
          <div>
            <span>Current mileage ({transportation?.measurement}):</span>
            <span className={classes["title"]}>
              {transportation?.currentMileage}
            </span>
          </div>
          <div>
            <span>Last service ({transportation?.measurement}):</span>
            <span className={classes["title"]}>
              {transportation?.lastServiceMileage}
            </span>
          </div>
          <div>
            <span>Inter service ({transportation?.measurement}):</span>
            <span className={classes["title"]}>
              {transportation?.interServiceMileage}
            </span>
          </div>
        </div>
        <div className={classes["fourth-block"]}>
          <div className={classes["title-wrapper"]}>
            <span>Spare PR details:</span>
            <Tooltip
              title={
                <>
                  {"Requested Date: "}
                  {transportation?.sparePRs[0]?.requestedDate
                    ? moment(transportation?.sparePRs[0]?.requestedDate).format(
                        DATETIME_FORMATS.DAY_MONTH_YEAR
                      )
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

      <div className={classes["fifth-block"]}>
        <TransportationStatusTag status={transportation?.status} />
      </div>
    </div>
  );
};

export default TransportationCard;
