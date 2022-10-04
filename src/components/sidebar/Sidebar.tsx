import {
  FaHome,
  FaUsers,
  FaTruck,
  FaTractor,
  FaLock,
  FaPager,
  FaCog,
  FaSquare,
  FaUserPlus,
  FaCode,
  FaRecycle,
} from "react-icons/fa";
import { RiSailboatFill } from "react-icons/ri";
import classes from "./Sidebar.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import UserContext from "../../contexts/UserContext";
import { Badge, Menu, Tooltip } from "antd";
import { useLazyQuery } from "@apollo/client";
import { errorMessage } from "../../helpers/gql";
import {
  CHECKLISTS_WITH_ISSUE_PAST_TWO,
  GET_ALL_CHECKLIST_AND_PM_SUMMARY,
  GET_BREAKDOWN_COUNT_OF_ALL,
  INCOMPLETE_CHECKLIST_PAST_TWO,
} from "../../api/queries";
import { hasPermissions, isAssignedTypeToAny } from "../../helpers/permissions";

const { Divider } = Menu;
interface SidebarItem {
  name: string;
  path: string;
  icon?: any;
  count?: number;
}

const Sidebar = ({ onClick }: { onClick: () => void }) => {
  const { user: self } = useContext(UserContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [allEntityBreakdownCount, { data: breakdownData }] = useLazyQuery(
    GET_BREAKDOWN_COUNT_OF_ALL,
    {
      onError: (err) => {
        errorMessage(err, "Error loading breakdown count.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  const [getPastTwoDayIncompleteChecklists, { data: pastTwoIncomplete }] =
    useLazyQuery(INCOMPLETE_CHECKLIST_PAST_TWO, {
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  const [getPastTwoDayChecklistsWithIssue, { data: pastTwoIssue }] =
    useLazyQuery(CHECKLISTS_WITH_ISSUE_PAST_TWO, {
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  // Refetch past two day incomplete checklist count every hour
  // Refetch past two day checklist with issue count every hour
  useEffect(() => {
    var handle = setInterval(getPastTwoDayIncompleteChecklists, 60 * 60 * 1000);
    var handle2 = setInterval(getPastTwoDayChecklistsWithIssue, 60 * 60 * 1000);
    return () => {
      clearInterval(handle);
      clearInterval(handle2);
    };
  });

  const [getAllEntityChecklistAndPMSummary, { data: summaryData }] =
    useLazyQuery(GET_ALL_CHECKLIST_AND_PM_SUMMARY, {
      onError: (err) => {
        errorMessage(err, "Error loading summary data.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  useEffect(() => {
    allEntityBreakdownCount();
    getAllEntityChecklistAndPMSummary();
    getPastTwoDayIncompleteChecklists();
    getPastTwoDayChecklistsWithIssue();
  }, [
    allEntityBreakdownCount,
    getAllEntityChecklistAndPMSummary,
    getPastTwoDayIncompleteChecklists,
    getPastTwoDayChecklistsWithIssue,
  ]);

  let SidebarData: SidebarItem[] = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FaHome />,
    },
  ];

  if (
    isAssignedTypeToAny("Admin", self) ||
    isAssignedTypeToAny("User", self) ||
    hasPermissions(self, ["VIEW_ALL_ENTITY"])
  ) {
    SidebarData.push({
      name: "Incomplete Tasks",
      path: "/incomplete-tasks",
      icon: <FaSquare />,
      count: pastTwoIncomplete?.incompleteChecklistsPastTwoDays
        ? pastTwoIncomplete.incompleteChecklistsPastTwoDays[0]
        : 0,
    });
  }

  if (
    isAssignedTypeToAny("Admin", self) ||
    isAssignedTypeToAny("Engineer", self) ||
    hasPermissions(self, ["VIEW_ALL_ENTITY"])
  ) {
    SidebarData.push({
      name: "Issues",
      path: "/issues",
      icon: <FaSquare />,
      count: pastTwoIssue?.checklistsWithIssuePastTwoDays
        ? pastTwoIssue.checklistsWithIssuePastTwoDays[0]
        : 0,
    });
  }

  SidebarData.push({
    name: "Divider",
    path: "divider1",
  });

  if (
    self?.machineAssignments.length > 0 ||
    hasPermissions(self, ["VIEW_ALL_ENTITY"]) ||
    hasPermissions(self, ["VIEW_ALL_MACHINERY"])
  ) {
    // Insert at second position
    SidebarData.push({
      name: "Machinery",
      path: "/machinery",
      icon: <FaTractor />,
      count: breakdownData?.allEntityBreakdownCount?.machine,
    });
  }

  if (
    self?.vesselAssignments.length > 0 ||
    hasPermissions(self, ["VIEW_ALL_ENTITY"]) ||
    hasPermissions(self, ["VIEW_ALL_VESSELS"])
  ) {
    SidebarData.push({
      name: "Vessels",
      path: "/vessels",
      icon: <RiSailboatFill />,
      count: breakdownData?.allEntityBreakdownCount?.vessel,
    });
  }

  if (
    self?.vehicleAssignments.length > 0 ||
    hasPermissions(self, ["VIEW_ALL_ENTITY"]) ||
    hasPermissions(self, ["VIEW_ALL_VEHICLES"])
  ) {
    SidebarData.push({
      name: "Vehicles",
      path: "/vehicles",
      icon: <FaTruck />,
      count: breakdownData?.allEntityBreakdownCount?.vehicle,
    });
  }

  if (hasPermissions(self, ["VIEW_ALL_ENTITY"])) {
    SidebarData.push({
      name: "Dispose",
      path: "/dispose",
      icon: <FaRecycle />,
    });
  }

  SidebarData.push({
    name: "Divider",
    path: "divider2",
  });

  if (hasPermissions(self, ["ASSIGN_TO_ENTITY"])) {
    SidebarData.push({
      name: "Assignments",
      path: "/assignments",
      icon: <FaUserPlus />,
    });
  }
  if (hasPermissions(self, ["VIEW_USERS"])) {
    SidebarData.splice(10, 0, {
      name: "Users",
      path: "/users",
      icon: <FaUsers />,
    });
  }
  if (hasPermissions(self, ["VIEW_ROLES"])) {
    SidebarData.splice(11, 0, {
      name: "Roles",
      path: "/roles",
      icon: <FaLock />,
    });
  }

  if (hasPermissions(self, ["VIEW_TEMPLATES", "MODIFY_TEMPLATES"], "any")) {
    SidebarData.push({
      name: "Templates",
      path: "/templates",
      icon: <FaPager />,
    });
  }

  if (hasPermissions(self, ["VIEW_KEYS", "MODIFY_KEYS"], "any")) {
    SidebarData.push({
      name: "Developer Options",
      path: "/developer",
      icon: <FaCode />,
    });
  }

  if (hasPermissions(self, ["MODIFY_TYPES", "MODIFY_LOCATIONS"], "any")) {
    SidebarData.push({
      name: "Config",
      path: "/config",
      icon: <FaCog />,
    });
  }
  /*
    if (self?.assignedPermission?.hasViewMachineryReport) {
      SidebarData.splice(13, 0, {
        name: "Machinery Report",
        path: "/machinery-report",
        icon: <FaRegChartBar />,
      });
    }
    if (self?.assignedPermission?.hasViewTransportationReport) {
      SidebarData.splice(14, 0, {
        name: "Transportation Report",
        path: "/transportation-report",
        icon: <FaRegChartBar />,
      });
    }
  */

  return (
    <>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        style={{ overflowX: "hidden", flex: 1 }}
      >
        {SidebarData.map((item: SidebarItem) => {
          if (item.name === "Divider") return <Divider key={item.path} />;
          return (
            <Menu.Item
              key={item.path}
              icon={item.icon}
              className={classes["newMenuItem"]}
              onClick={() => {
                navigate(item.path);
                onClick();
              }}
            >
              {item.name}{" "}
              <Badge
                showZero={false}
                count={item.count ?? 0}
                style={{ marginLeft: 10, marginRight: 10 }}
              />
              {summaryData?.getAllEntityChecklistAndPMSummary
                ?.machineTaskComplete === true &&
                item.name === "Machinery" && (
                  <Tooltip
                    color="var(--dot-tooltip)"
                    title={
                      <div>
                        <Badge
                          color={"red"}
                          text={"Some tasks not completed"}
                        />
                      </div>
                    }
                  >
                    <Badge color={"red"} />
                  </Tooltip>
                )}
              {summaryData?.getAllEntityChecklistAndPMSummary
                ?.machineChecklistComplete === true &&
                item.name === "Machinery" && (
                  <Tooltip
                    color="var(--dot-tooltip)"
                    title={
                      <div>
                        <Badge
                          color={"red"}
                          text={"Some checklists not completed"}
                        />
                      </div>
                    }
                  >
                    <Badge color={"red"} />
                  </Tooltip>
                )}
              {summaryData?.getAllEntityChecklistAndPMSummary
                ?.vehicleTaskComplete === true &&
                item.name === "Vehicles" && (
                  <Tooltip
                    color="var(--dot-tooltip)"
                    title={
                      <div>
                        <Badge
                          color={"red"}
                          text={"Some tasks not completed"}
                        />
                      </div>
                    }
                  >
                    <Badge color={"red"} />
                  </Tooltip>
                )}
              {summaryData?.getAllEntityChecklistAndPMSummary
                ?.vehicleChecklistComplete === true &&
                item.name === "Vehicles" && (
                  <Tooltip
                    color="var(--dot-tooltip)"
                    title={
                      <div>
                        <Badge
                          color={"red"}
                          text={"Some checklists not completed"}
                        />
                      </div>
                    }
                  >
                    <Badge color={"red"} />
                  </Tooltip>
                )}
              {summaryData?.getAllEntityChecklistAndPMSummary
                ?.vesselTaskComplete === true &&
                item.name === "Vessels" && (
                  <Tooltip
                    color="var(--dot-tooltip)"
                    title={
                      <div>
                        <Badge
                          color={"red"}
                          text={"Some tasks not completed"}
                        />
                      </div>
                    }
                  >
                    <Badge color={"red"} />
                  </Tooltip>
                )}
              {summaryData?.getAllEntityChecklistAndPMSummary
                ?.vesselChecklistComplete === true &&
                item.name === "Vessels" && (
                  <Tooltip
                    color="var(--dot-tooltip)"
                    title={
                      <div>
                        <Badge
                          color={"red"}
                          text={"Some checklists not completed"}
                        />
                      </div>
                    }
                  >
                    <Badge color={"red"} />
                  </Tooltip>
                )}
            </Menu.Item>
          );
        })}
      </Menu>
    </>
  );
};

export default Sidebar;
