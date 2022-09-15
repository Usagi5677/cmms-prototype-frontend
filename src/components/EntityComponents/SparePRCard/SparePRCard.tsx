import { ToolOutlined } from "@ant-design/icons";
import { Collapse, Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { hasPermissions } from "../../../helpers/permissions";
import SparePR from "../../../models/Entity/SparePR";
import DeleteSparePR from "../DeleteSparePR/DeleteSparePR";
import EditSparePR from "../EditSparePR/EditSparePR";
import classes from "./SparePRCard.module.css";

const SparePRCard = ({
  sparePR,
  isDeleted,
}: {
  sparePR: SparePR;
  isDeleted: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);
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
                <div className={classes["level-one"]}>
                  <div className={classes["info-wrapper"]}>
                    <div className={classes["first-block"]}>
                      <div
                        className={
                          (classes["title-wrapper"], classes["space-two"])
                        }
                      >
                        {sparePR?.requestedDate ? (
                          <>
                            <Tooltip title="Requested Date">
                              <FaRegClock className={classes["icon"]} />
                            </Tooltip>
                            <span
                              className={classes["title"]}
                              title={moment(sparePR?.requestedDate).format(
                                DATETIME_FORMATS.FULL
                              )}
                            >
                              {moment(sparePR?.requestedDate).format(
                                DATETIME_FORMATS.SHORT
                              )}
                            </span>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Requested Date">
                              <FaRegClock className={classes["icon"]} />
                            </Tooltip>
                            <span className={classes["title"]}>None</span>
                          </>
                        )}
                      </div>
                      <div
                        className={(classes["reading"], classes["flex-limit"])}
                      >
                        <span className={classes["reading-title"]}>Name:</span>
                        {sparePR?.name}
                      </div>
                    </div>
                  </div>
                  <div className={classes["second-block"]}>
                    {hasPermissions(self, ["MODIFY_SPARE_PR"]) ? (
                      <EditSparePR sparePR={sparePR} isDeleted={isDeleted} />
                    ) : null}
                    {hasPermissions(self, ["MODIFY_SPARE_PR"]) ? (
                      <DeleteSparePR id={sparePR.id} isDeleted={isDeleted} />
                    ) : null}
                  </div>
                </div>
                <div className={classes["level-two"]}>
                  <div className={(classes["id-wrapper"], classes["space"])}>
                    <ToolOutlined className={classes["icon"]} />
                    <span className={classes["title"]}>{sparePR?.id}</span>
                  </div>
                  <div className={(classes["title-wrapper"], classes["space"])}>
                    <Tooltip title="Created Date">
                      <FaRegClock className={classes["icon"]} />
                    </Tooltip>

                    <span
                      className={classes["title"]}
                      title={moment(sparePR?.createdAt).format(
                        DATETIME_FORMATS.FULL
                      )}
                    >
                      {moment(sparePR?.createdAt).format(
                        DATETIME_FORMATS.SHORT
                      )}
                    </span>
                  </div>
                  <div
                    className={(classes["createdBy-wrapper"], classes["space"])}
                  >
                    <Tooltip title="Created by">
                      <FaRegUser />
                    </Tooltip>
                    <div className={classes["createdBy"]}>
                      {sparePR?.createdBy?.fullName}{" "}
                      {"(" + sparePR?.createdBy?.rcno + ")"}
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          key={sparePR.id}
        >
          <div className={classes["collapse-container"]}>
            <div className={classes["inner-info"]}></div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default SparePRCard;
