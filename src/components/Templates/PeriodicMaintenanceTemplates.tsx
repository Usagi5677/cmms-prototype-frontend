import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ALL_PERIODIC_MAINTENANCE } from "../../api/queries";
import { PAGE_LIMIT } from "../../helpers/constants";
import { errorMessage } from "../../helpers/gql";
import DefaultPaginationArgs from "../../models/DefaultPaginationArgs";
import PaginationArgs from "../../models/PaginationArgs";
import PaginationButtons from "../common/PaginationButtons/PaginationButtons";
import Search from "../common/Search";
import type { ColumnsType } from "antd/es/table";
import { DeleteListing } from "../common/DeleteListing";
import {
  DELETE_ORIGIN_PERIODIC_MAINTENANCE,
  DELETE_PERIODIC_MAINTENANCE,
} from "../../api/mutations";
import { hasPermissions } from "../../helpers/permissions";
import UserContext from "../../contexts/UserContext";
import PeriodicMaintenance from "../../models/PeriodicMaintenance/PeriodicMaintenance";
import { PeriodicMaintenanceTemplateDetails } from "./PeriodicMaintenanceTemplateDetails";
import { CreatePeriodicMaintenance } from "./CreatePeriodicMaintenance";
import UpsertPMNotificationReminder from "../common/EditPMNotificationReminder/UpsertPMNotificationReminder";
import classes from "./Templates.module.css";

export interface PeriodicMaintenanceTemplatesProps {}

export const PeriodicMaintenanceTemplates: React.FC<
  PeriodicMaintenanceTemplatesProps
> = ({}) => {
  const { user } = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      type: string;
    }
  >({
    ...DefaultPaginationArgs,
    search: "",
    type: "Origin",
  });

  const [periodicMaintenances, { data, loading }] = useLazyQuery(
    ALL_PERIODIC_MAINTENANCE,
    {
      onError: (err) => {
        errorMessage(err, "Error loading periodic maintenance templates.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    periodicMaintenances({ variables: filter });
  }, [filter, periodicMaintenances]);

  const searchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          ...DefaultPaginationArgs,
        }));
        setPage(1);
      }, 500)
    );
  };
  const initialRender = useRef<boolean>(true);
  useEffect(() => {
    if (initialRender.current === true) {
      initialRender.current = false;
      return;
    }
    searchDebounced(search);
    // eslint-disable-next-line
  }, [search]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: PAGE_LIMIT,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: PAGE_LIMIT,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const columns: ColumnsType<PeriodicMaintenance> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "100%",
    },
  ];

  if (hasPermissions(user, ["MODIFY_TEMPLATES"])) {
    columns.push({
      title: "",
      dataIndex: "action",
      key: "action",
      // width: "33%",
      render: (val, rec) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: ".5rem" }}>
            <PeriodicMaintenanceTemplateDetails periodicMaintenance={rec} />
          </div>
          {/* <div style={{ marginRight: ".5rem" }}>
            <UpsertPMNotificationReminder periodicMaintenance={rec}/>
          </div>*/}

          <DeleteListing
            id={rec.id}
            mutation={DELETE_ORIGIN_PERIODIC_MAINTENANCE}
            refetchQueries={["periodicMaintenances"]}
          />
        </div>
      ),
    });
  }

  const pageInfo = data?.periodicMaintenances.pageInfo ?? {};

  return (
    <div>
      <div className={classes["option-container"]}>
        <div className={classes["option-wrapper"]}>
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
          />
        </div>
        {hasPermissions(user, ["MODIFY_TEMPLATES"]) && (
          <CreatePeriodicMaintenance />
        )}
      </div>
      <Table
        rowKey="id"
        dataSource={data?.periodicMaintenances.edges.map(
          (edge: { node: PeriodicMaintenance }) => edge.node
        )}
        columns={columns}
        pagination={false}
        size="small"
        showHeader={false}
        loading={loading}
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
      />
      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
      />
    </div>
  );
};
