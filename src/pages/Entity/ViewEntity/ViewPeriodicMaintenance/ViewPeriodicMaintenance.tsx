import { useLazyQuery } from "@apollo/client";
import { Spin, Tabs } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { ALL_PERIODIC_MAINTENANCE } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import { errorMessage } from "../../../../helpers/gql";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewPeriodicMaintenance.module.css";
import UserContext from "../../../../contexts/UserContext";
import { useParams } from "react-router";
import PeriodicMaintenance from "../../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceCard from "../../../../components/EntityComponents/PeriodicMaintenanceCard/PeriodicMaintenanceCard";
import UpcomingPeriodicMaintenances from "./Upcoming/UpcomingPeriodicMaintenances";
import ReadyPeriodicMaintenances from "./Ready/ReadyPeriodicMaintenances";

const ViewPeriodicMaintenance = ({
  isDeleted,
}: {
  isDeleted?: boolean | undefined;
}) => {
  return (
    <Tabs
      defaultActiveKey="checklist"
      style={{
        flex: 1,
      }}
    >
      <Tabs.TabPane tab="Ready" key="ready">
        <ReadyPeriodicMaintenances isDeleted={isDeleted} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Upcoming" key="upcoming">
        <UpcomingPeriodicMaintenances isDeleted={isDeleted} />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default ViewPeriodicMaintenance;
