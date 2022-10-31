import { ToolOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Checkbox, Collapse, Spin, Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import { TOGGLE_SPARE_PR_COMPLETE } from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { hasPermissions, isAssignedType } from "../../../helpers/permissions";
import { Entity } from "../../../models/Entity/Entity";
import SparePR from "../../../models/Entity/SparePR";
import { AddSparePRDetail } from "../AddSparePRDetail";
import DeleteSparePR from "../DeleteSparePR/DeleteSparePR";
import EditSparePR from "../EditSparePR/EditSparePR";
import SparePRDetailCard from "../SparePRDetailCard/SparePRDetailCard";
import classes from "./SparePRCard.module.css";

const SparePRCard = ({
  sparePR,
  isDeleted,
  entity,
}: {
  sparePR: SparePR;
  isDeleted: boolean | undefined;
  entity: Entity;
}) => {
  const { user: self } = useContext(UserContext);
  const [toggle, { loading: toggling }] = useMutation(
    TOGGLE_SPARE_PR_COMPLETE,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating complete.");
      },
      refetchQueries: ["sparePRs", "getAllHistoryOfEntity"],
    }
  );
  return (
    <div id="collapseTwo">
      <Collapse ghost style={{ marginBottom: ".5rem" }}>
        <Collapse.Panel
          header={
            <>
              <div className={classes["header-container"]}>
                <div className={classes["level-one"]}>
                  <div className={classes["info-wrapper"]}>
                    <div className={classes["first-block"]}>
                      <div className={classes["space-two"]}>
                        <Checkbox
                          checked={sparePR?.completedAt !== null}
                          disabled={
                            (!hasPermissions(self, ["MODIFY_SPARE_PR"]) &&
                              !isAssignedType("Admin", entity!, self) &&
                              !isAssignedType("Engineer", entity!, self)) ||
                            isDeleted
                          }
                          onChange={(e) =>
                            toggle({
                              variables: {
                                id: sparePR.id,
                                complete: e.target.checked,
                              },
                            })
                          }
                          style={{ wordBreak: "break-all" }}
                        >
                          Complete{" "}
                          {toggling && (
                            <Spin style={{ marginRight: 5 }} size="small" />
                          )}
                        </Checkbox>
                      </div>

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
            <span className={classes["inner-header"]}>Details</span>
            {sparePR?.sparePRDetails?.map((d) => (
              <SparePRDetailCard
                key={d.id}
                sparePRDetail={d}
                hasPermission={
                  hasPermissions(self, ["MODIFY_SPARE_PR"]) ||
                  isAssignedType("Admin", entity, self) ||
                  isAssignedType("Engineer", entity, self)
                }
              />
            ))}
            <div style={{ marginTop: 10 }}>
              <AddSparePRDetail sparePRId={sparePR.id} />
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default SparePRCard;
