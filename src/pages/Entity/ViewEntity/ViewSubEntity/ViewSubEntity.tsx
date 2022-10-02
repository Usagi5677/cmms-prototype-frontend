import { Collapse, Divider } from "antd";
import { DELETE_ENTITY } from "../../../../api/mutations";
import { DeleteListing } from "../../../../components/common/DeleteListing";
import EditEntity from "../../../../components/EntityComponents/EditEntity/EditEntity";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import { Entity } from "../../../../models/Entity/Entity";
import classes from "./ViewSubEntity.module.css";

const ViewSubEntity = ({
  subEntity,
  isDeleted,
}: {
  subEntity: Entity;
  isDeleted?: boolean;
}) => {
  const isSmallDevice = useIsSmallDevice(600, true);
  return (
    <div id="subEntityCollapse">
      <Collapse
        ghost
        className={classes["container"]}
        defaultActiveKey={"subEntity"}
      >
        <Collapse.Panel
          key={"subEntity"}
          header={<div className={classes["header-title"]}>Sub Entity</div>}
        >
          <div className={classes["info-container"]}>
            {subEntity?.subEntities?.map((s: Entity, index: number) => (
              <div className={classes["info-wrapper"]}>
                <div>
                  <div className={classes["info"]}>
                    <div className={classes["info-title"]}></div>
                    <div className={classes["options"]}>
                      <EditEntity
                        entity={s}
                        isDeleted={isDeleted}
                        fontSize={14}
                        includeSubEntity
                      />
                      <div className={classes["delete"]}>
                        <DeleteListing
                          id={s.id}
                          mutation={DELETE_ENTITY}
                          refetchQueries={["getAllEntity", "getSingleEntity"]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={classes["info"]}>
                    <div className={classes["info-title"]}>Engine</div>
                    <div className={classes["info-content"]}>{s.engine}</div>
                  </div>
                  <div className={classes["info"]}>
                    <div className={classes["info-title"]}>Model</div>
                    <div className={classes["info-content"]}>{s.model}</div>
                  </div>
                  <div className={classes["info"]}>
                    <div className={classes["info-title"]}>Brand</div>
                    <div className={classes["info-content"]}>{s.brand}</div>
                  </div>
                  <div className={classes["info"]}>
                    <div className={classes["info-title"]}>
                      Current running {s.measurement}
                    </div>
                    <div className={classes["info-content"]}>
                      {s.currentRunning}
                    </div>
                  </div>
                  <div className={classes["info"]}>
                    <div className={classes["info-title"]}>
                      Last service {s.measurement}
                    </div>
                    <div className={classes["info-content"]}>
                      {s.lastService}
                    </div>
                  </div>
                  <div className={classes["info"]}>
                    <div className={classes["info-title"]}>
                      Inter service {s.measurement}
                    </div>
                    <div className={classes["info-content"]}>
                      {(s?.currentRunning ?? 0) - (s?.lastService ?? 0)}
                    </div>
                  </div>
                </div>
                {index + 1 !== subEntity?.subEntities?.length && (
                  <Divider
                    style={{
                      height: "100%",
                    }}
                    type={isSmallDevice ? "vertical" : "horizontal"}
                  />
                )}
              </div>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default ViewSubEntity;

/*


<div className={classes["info-container"]}>
            <div className={classes["info-wrapper"]}>
              <div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Engine</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Model</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Brand</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Current running d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Last service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Inter service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
              </div>
              <Divider
                style={{
                  height: "100%",
                }}
                type={isSmallDevice ? "vertical" : "horizontal"}
              />
            </div>
            <div className={classes["info-wrapper"]}>
              <div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Engine</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Model</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Brand</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Current running d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Last service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Inter service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
              </div>
              <Divider
                style={{
                  height: "100%",
                }}
                type={isSmallDevice ? "vertical" : "horizontal"}
              />
            </div>
            <div className={classes["info-wrapper"]}>
              <div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Engine</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Model</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Brand</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Current running d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Last service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Inter service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
              </div>
              <Divider
                style={{
                  height: "100%",
                }}
                type={isSmallDevice ? "vertical" : "horizontal"}
              />
            </div>
            <div className={classes["info-wrapper"]}>
              <div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Engine</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Model</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Brand</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Current running d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Last service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Inter service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
              </div>
              <Divider
                style={{
                  height: "100%",
                }}
                type={isSmallDevice ? "vertical" : "horizontal"}
              />
            </div>
            <div className={classes["info-wrapper"]}>
              <div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Engine</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Model</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Brand</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Current running d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Last service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Inter service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
              </div>
              <Divider
                style={{
                  height: "100%",
                }}
                type={isSmallDevice ? "vertical" : "horizontal"}
              />
            </div>
            <div className={classes["info-wrapper"]}>
              <div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Engine</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Model</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Brand</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Current running d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Last service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
                <div className={classes["info"]}>
                  <div className={classes["info-title"]}>Inter service d</div>
                  <div className={classes["info-content"]}>d</div>
                </div>
              </div>
              <Divider
                style={{
                  height: "100%",
                }}
                type={isSmallDevice ? "vertical" : "horizontal"}
              />
            </div>
          </div>

*/
