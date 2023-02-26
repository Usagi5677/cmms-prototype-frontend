import { ToolFilled } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Badge, Empty, Popover, Tabs, Timeline } from "antd";
import { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GET_ALL_CHECKLIST_AND_PM_SUMMARY } from "../../api/queries";
import classes from "./TaskNotification.module.css";

const TaskNotification = () => {
  const navigate = useNavigate();
  const [getSummary, { data, loading }] = useLazyQuery(
    GET_ALL_CHECKLIST_AND_PM_SUMMARY,
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Refetch past two day incomplete checklist count every hour
  useEffect(() => {
    var handle = setInterval(getSummary, 60 * 60 * 1000);
    return () => {
      clearInterval(handle);
    };
  });

  useEffect(() => {
    getSummary();
  }, [getSummary]);

  return (
    <Popover
      placement="bottomRight"
      trigger={["click"]}
      content={
        <div className={classes["tab-container"]}>
          <span className={classes["note"]}>checks every hour</span>
          <Tabs style={{ width: "100%" }}>
            <Tabs.TabPane
              tab={
                <Badge
                  count={`${data?.getAllEntityChecklistAndPMSummary?.checklist?.length}`}
                  size="small"
                  offset={[4, -4]}
                >
                  <span>Checklist</span>
                </Badge>
              }
              key={"checklist"}
            >
              <div className={classes["inner-container"]}>
                {data?.getAllEntityChecklistAndPMSummary?.checklist?.length >
                0 ? (
                  <Timeline style={{ marginTop: 10 }}>
                    {data?.getAllEntityChecklistAndPMSummary?.checklist?.map(
                      (
                        e: { id: number; machineNumber: string },
                        index: number
                      ) => {
                        return (
                          <div key={index} className={classes["item-wrapper"]}>
                            <Link to={`/entity/${e?.id}`}>
                              <Timeline.Item>
                                <span className={classes["item"]}>
                                  {e?.machineNumber}
                                </span>
                              </Timeline.Item>
                            </Link>
                          </div>
                        );
                      }
                    )}
                  </Timeline>
                ) : (
                  <Empty />
                )}
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <Badge
                  count={`${data?.getAllEntityChecklistAndPMSummary?.pm?.length}`}
                  size="small"
                  offset={[4, -4]}
                >
                  <span>Task</span>
                </Badge>
              }
              key={"task"}
            >
              <div className={classes["inner-container"]}>
                {data?.getAllEntityChecklistAndPMSummary?.pm?.length > 0 ? (
                  <Timeline style={{ marginTop: 10 }}>
                    {data?.getAllEntityChecklistAndPMSummary?.pm?.map(
                      (
                        e: { id: number; machineNumber: string },
                        index: number
                      ) => {
                        return (
                          <div key={index} className={classes["item-wrapper"]}>
                            <Link
                              to={`/entity/${e?.id}?tab=periodicMaintenance`}
                            >
                              <Timeline.Item>
                                <span className={classes["item"]}>
                                  {e?.machineNumber}
                                </span>
                              </Timeline.Item>
                            </Link>
                          </div>
                        );
                      }
                    )}
                  </Timeline>
                ) : (
                  <Empty />
                )}
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      }
    >
      <Badge
        count={`${
          data?.getAllEntityChecklistAndPMSummary?.checklist?.length +
          data?.getAllEntityChecklistAndPMSummary?.pm?.length
        }`}
        size="small"
        offset={[-16, 2]}
      >
        <ToolFilled className={classes["icon"]} />
      </Badge>
    </Popover>
  );
};

export default memo(TaskNotification);
