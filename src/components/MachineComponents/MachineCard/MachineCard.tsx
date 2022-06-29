import {
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
import { Tooltip } from "antd";

const MachineCard = ({ machine }: { machine: Machine }) => {
  let borderLeft: string;
  let border: string;
  if (machine?.interService! >= 500) {
    borderLeft = "8px solid red";
    border = "2px solid red";
  } else if (machine?.interService! >= 400) {
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
            <span className={classes["title"]}>{machine?.interService}</span>
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
  );
};

export default MachineCard;

/*
<div className={classes["machinaries-wrapper"]}>
      <div className={classes["machinaries-wrapper__user-details-container"]}>
        <div className={classes["machinaries-wrapper__user-details-wrapper"]}>
          <div
            className={
              classes["machinaries-wrapper__machinaries-details__info-wrapper"]
            }
          >
            <div
              className={
                classes[
                  "machinaries-wrapper__machinaries-details__priority-wrapper"
                ]
              }
            >
              <div
                className={
                  classes[
                    "machinaries-wrapper__machinaries-details__priority-title"
                  ]
                }
              >
                {props.machine.id}
              </div>
              <div
                className={
                  classes[
                    "machinaries-wrapper__machinaries-details__category-title"
                  ]
                }
              >
                Ex-31
              </div>
              <div
                className={
                  classes[
                    "machinaries-wrapper__machinaries-details__category-title"
                  ]
                }
              >
                {props.machine.zone} - {props.machine.location}
              </div>
              <div
                className={
                  classes[
                    "machinaries-wrapper__machinaries-details__category-title"
                  ]
                }
              >
                <FaGlobe /> Registered at <span>{props.machine.registeredDate}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={classes["machinaries-wrapper__divider"]}></div>
        <div
          className={
            classes["machinaries-wrapper__machinaries-details-wrapper"]
          }
        >
          <div
            className={
              classes["machinaries-wrapper__machinaries-details__title"]
            }
          ></div>
          <div
            className={
              classes[
                "machinaries-wrapper__machinaries-details__info-container"
              ]
            }
          >
            <div
              className={
                classes[
                  "machinaries-wrapper__machinaries-details__info-wrapper"
                ]
              }
            >
              <div
                className={
                  classes[
                    "machinaries-wrapper__machinaries-details__category-wrapper"
                  ]
                }
              >
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__category-title"
                    ]
                  }
                >
                  Model:{" "}
                  <span
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__group-name"
                      ]
                    }
                  >
                    {props.machine.model}
                  </span>
                </div>
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__category-title"
                    ]
                  }
                >
                  Type:{" "}
                  <span
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__group-name"
                      ]
                    }
                  >
                    {props.machine.type}
                  </span>
                </div>
              </div>
              <div
                className={
                  classes[
                    "machinaries-wrapper__machinaries-details__priority-wrapper"
                  ]
                }
              >
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__priority-title"
                    ]
                  }
                >
                  Current running (hr):{" "}
                  <span
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__group-name"
                      ]
                    }
                  >
                    {props.machine.currentRunningHrs}
                  </span>
                </div>
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__category-title"
                    ]
                  }
                >
                  Last service (hr):{" "}
                  <span
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__group-name"
                      ]
                    }
                  >
                    3133
                  </span>
                </div>
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__category-title"
                    ]
                  }
                >
                  Inter service (hr):{" "}
                  <span
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__group-name"
                      ]
                    }
                  >
                    13
                  </span>
                </div>
              </div>
            </div>
            <div
              className={
                classes[
                  "machinaries-wrapper__machinaries-details__info-wrapper"
                ]
              }
            >
              <div
                className={
                  classes[
                    "machinaries-wrapper__machinaries-details__agent-wrapper"
                  ]
                }
              >
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__agent-title"
                    ]
                  }
                >
                  Spare pr date:{" "}
                  <span
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__group-name"
                      ]
                    }
                  >
                    12/2/2022
                  </span>
                </div>
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__agent-title"
                    ]
                  }
                >
                  Spare pr status:{" "}
                  <span
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__group-name"
                      ]
                    }
                  >
                    Status
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            classes["machinaries-wrapper__machinaries-activity-wrapper"]
          }
        >
          <div
            className={
              classes[
                "machinaries-wrapper__machinaries-activity__started-wrapper"
              ]
            }
          >
            <div
              className={
                classes["machinaries-wrapper__machinaries-activity__started"]
              }
            >
              Estimated Completion:
              <span
                className={
                  classes[
                    "machinaries-wrapper__machinaries-activity__started-date"
                  ]
                }
              >
                11/11/2021
              </span>
            </div>
            <div
              className={
                classes["machinaries-wrapper__machinaries-activity__status"]
              }
            >
              Working
            </div>
          </div>
        </div>
      </div>
    </div>
*/
