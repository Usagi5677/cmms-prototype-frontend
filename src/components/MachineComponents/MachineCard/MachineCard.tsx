import {
  FaArrowAltCircleRight,
  FaGlobe,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaRegClock,
  FaTractor,
} from "react-icons/fa";
import MachineStatusTag from "../../common/MachineStatusTag";
import classes from "./MachineCard.module.css";
import Machine from "../../../models/Machine";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { Collapse, Tooltip } from "antd";
import { Link } from "react-router-dom";

const MachineCard = ({ machine }: { machine: Machine }) => {
  let borderLeft: string;
  let border: string;
  const interService =
    (machine.currentRunning ?? 0) - (machine.lastService ?? 0);
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
                      {machine?.machineNumber}
                    </span>
                  </div>
                  <div className={classes["location-wrapper"]}>
                    <FaMapMarkerAlt />
                    <span className={classes["title"]}>{machine?.zone}</span>
                    <span className={classes["dash"]}>-</span>
                    <span>{machine?.location}</span>
                  </div>
                </div>

                <div className={classes["service-reading-wrapper"]}>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Current running ({machine?.measurement}):
                    </span>
                    <span>{machine?.currentRunning}</span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Last service ({machine?.measurement}):
                    </span>
                    <span>{machine?.lastService}</span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Inter service ({machine?.measurement}):
                    </span>
                    <span>{interService}</span>
                  </div>
                  <div className={classes["status"]}>
                    <MachineStatusTag status={machine?.status} />
                  </div>
                </div>
                <Link to={"/machine/" + machine.id}>
                  <Tooltip title="Open">
                    <FaArrowAltCircleRight className={classes["button"]} />
                  </Tooltip>
                </Link>
              </div>
            </>
          }
          key={machine.id}
        >
          <div className={classes["container"]}>
            <div className={classes["title-wrapper"]}>
              <Tooltip title="Registered Date">
                <FaRegClock />
              </Tooltip>

              <span className={classes["title"]}>
                {moment(machine?.registeredDate).format(
                  DATETIME_FORMATS.DAY_MONTH_YEAR
                )}
              </span>
            </div>
            <div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Model:</span>
                <span>{machine?.model}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Type:</span>
                <span>{machine?.type?.name}</span>
              </div>
            </div>

            <div>
              <div className={classes["title-wrapper"]}>
                <span>Spare PR details:</span>
                <Tooltip
                  title={
                    <>
                      {"Requested Date: "}
                      {machine?.sparePRs[0]?.requestedDate
                        ? moment(machine?.sparePRs[0]?.requestedDate).format(
                            DATETIME_FORMATS.DAY_MONTH_YEAR
                          )
                        : null}
                      <br />
                      {"Title: "}
                      {machine?.sparePRs[0]?.title}
                      <br />
                      {"Description: "}
                      {machine?.sparePRs[0]?.description}
                      <br />
                      {"Status: "}
                      {machine?.sparePRs[0]?.status}
                    </>
                  }
                >
                  <FaQuestionCircle style={{ marginLeft: 5 }} />
                </Tooltip>
              </div>
              {machine?.breakdowns[0] && (
                <div className={classes["title-wrapper"]}>
                  <span>Breakdown details:</span>
                  <Tooltip
                    title={
                      <>
                        {"Title: "}
                        {machine?.breakdowns[0]?.title}
                        <br />
                        {"Description: "}
                        {machine?.breakdowns[0]?.description}
                        <br />
                        {"Status: "}
                        {machine?.breakdowns[0]?.status}
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

export default MachineCard;

/*

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
            <span className={classes["title"]}>{machine?.machineNumber}</span>
          </div>
          <div className={classes["title-wrapper"]}>
            <FaMapMarkerAlt />
            <span className={classes["title"]}>{machine?.zone}</span>
            <span className={classes["dash"]}>-</span>
            <span>{machine?.location}</span>
          </div>
          <div className={classes["title-wrapper"]}>
            <FaRegClock />
            <span className={classes["title"]}>
              {moment(machine?.registeredDate).format(
                DATETIME_FORMATS.DAY_MONTH_YEAR
              )}
            </span>
          </div>
        </div>
        <div className={classes["second-block"]}>
          <div>
            <span>Model:</span>
            <span className={classes["title"]}>{machine?.model}</span>
          </div>
          <div>
            <span>Type:</span>
            <span className={classes["title"]}>{machine?.type}</span>
          </div>
        </div>
      </div>

      <div className={classes["second-wrapper"]}>
        <div className={classes["third-block"]}>
          <div>
            <span>Current running ({machine?.measurement}):</span>
            <span className={classes["title"]}>
              {machine?.currentRunning}
            </span>
          </div>
          <div>
            <span>Last service ({machine?.measurement}):</span>
            <span className={classes["title"]}>{machine?.lastService}</span>
          </div>
          <div>
            <span>Inter service ({machine?.measurement}):</span>
            <span className={classes["title"]}>{interService}</span>
          </div>
        </div>
        <div className={classes["fourth-block"]}>
          <div className={classes["title-wrapper"]}>
            <span>Spare PR details:</span>
            <Tooltip
              title={
                <>
                  {"Requested Date: "}
                  {machine?.sparePRs[0]?.requestedDate
                    ? moment(machine?.sparePRs[0]?.requestedDate).format(
                        DATETIME_FORMATS.DAY_MONTH_YEAR
                      )
                    : null}
                  <br />
                  {"Title: "}
                  {machine?.sparePRs[0]?.title}
                  <br />
                  {"Description: "}
                  {machine?.sparePRs[0]?.description}
                  <br />
                  {"Status: "}
                  {machine?.sparePRs[0]?.status}
                </>
              }
            >
              <FaQuestionCircle style={{ marginLeft: 5 }} />
            </Tooltip>
          </div>
          {machine?.breakdowns[0] && (
            <div className={classes["title-wrapper"]}>
              <span>Breakdown details:</span>
              <Tooltip
                title={
                  <>
                    {"Title: "}
                    {machine?.breakdowns[0]?.title}
                    <br />
                    {"Description: "}
                    {machine?.breakdowns[0]?.description}
                    <br />
                    {"Status: "}
                    {machine?.breakdowns[0]?.status}
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
        <MachineStatusTag status={machine?.status} />
      </div>
    </div>


*/

/*
css


.container {
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  padding: 5px;
  margin: 10px 0;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  transition: all 0.3s ease;
}
.container:hover {
  background-color: #dcdcdc;
  transform: translateX(6px);
}
.title-wrapper {
  display: flex;
  align-items: center;
}

.title {
  padding-left: 5px;
}

.first-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 10px;
}

.second-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.third-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 10px;
  padding-top: 10px;
}

.fourth-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fifth-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.first-wrapper,
.second-wrapper {
  display: flex;
  justify-content: space-around;
  flex-grow: 1;
}

.dash {
  padding: 0 5px;
}
@media only screen and (min-width: 800px) {
  .container {
    flex-direction: row;
    flex-grow: 1;
    padding: 10px;
  }
  .first-wrapper {
    justify-content: space-between;
    padding-right: 20px;
  }
  .second-wrapper {
    justify-content: space-between;
  }
  .first-block {
    flex-grow: 1;
  }
  .second-block {
    flex-grow: 1;
  }
  .third-block {
    flex-grow: 1;
    padding-top: 0;
  }
  .fourth-block {
    flex-grow: 1;
  }
  .fifth-block {
    flex-grow: 1;
    justify-content: center;
    align-items: flex-end;
  }
}

*/
