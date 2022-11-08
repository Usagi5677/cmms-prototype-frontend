import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import PaginationButtons from "../../common/PaginationButtons/PaginationButtons";
import Search from "../../common/Search";
import type { ColumnsType } from "antd/es/table";
import { DeleteListing } from "../../common/DeleteListing";
import { ZONES } from "../../../api/queries";
import { EditZone } from "./EditZone";
import { DELETE_ZONE } from "../../../api/mutations";
import Zone from "../../../models/Zone";
import { CreateZone } from "./CreateZone";
import { ZoneMapping } from "./ZoneMapping";
import classes from "./Zones.module.css";

export interface ZonesProps {}

export const Zones: React.FC<ZonesProps> = ({}) => {
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      name: string;
    }
  >({
    ...DefaultPaginationArgs,
    name: "",
  });

  const [getZones, { data, loading }] = useLazyQuery(ZONES, {
    onError: (err) => {
      errorMessage(err, "Error loading zones.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getZones({ variables: filter });
  }, [filter, getZones]);

  const searchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          name: value,
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

  const columns: ColumnsType<Zone> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: classes["font"],
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
      render: (val, rec) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <EditZone zone={rec} />
          <DeleteListing
            id={rec.id}
            mutation={DELETE_ZONE}
            refetchQueries={["zones"]}
          />
        </div>
      ),
    },
  ];

  const pageInfo = data?.zones.pageInfo ?? {};

  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem .5rem 0 0";
  return (
    <div>
      <div className={classes["options-wrapper"]}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: isSmallDevice ? "space-around" : undefined,
            margin: "-.5rem 1rem 0 0",
          }}
        >
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
            margin={filterMargin}
          />
        </div>
        <div className={classes["option"]}>
          <ZoneMapping />
          <div style={{ marginTop: 10 }}>
            <CreateZone />
          </div>
        </div>
      </div>
      <Table
        rowKey="id"
        dataSource={data?.zones.edges.map((edge: { node: Zone }) => edge.node)}
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
