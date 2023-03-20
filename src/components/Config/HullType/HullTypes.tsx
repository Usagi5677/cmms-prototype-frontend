import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { HULL_TYPES } from "../../../api/queries";
import { PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import PaginationButtons from "../../common/PaginationButtons/PaginationButtons";
import Search from "../../common/Search";
import type { ColumnsType } from "antd/es/table";
import { DeleteListing } from "../../common/DeleteListing";
import { DELETE_HULL_TYPE } from "../../../api/mutations";
import classes from "./HullTypes.module.css";
import HullType from "../../../models/HullType";
import { EditHullType } from "./EditHullType";
import { CreateHullType } from "./CreateHullType";

export interface HullTypeProps {}

export const HullTypes: React.FC<HullTypeProps> = ({}) => {
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

  const [getHullTypes, { data, loading }] = useLazyQuery(HULL_TYPES, {
    onError: (err) => {
      errorMessage(err, "Error loading hull types.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getHullTypes({ variables: filter });
  }, [filter, getHullTypes]);

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

  const columns: ColumnsType<HullType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "100%",
      className: classes["font"],
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
      // width: "33%",
      render: (val, rec) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EditHullType hullType={rec} />
          <DeleteListing
            id={rec.id}
            mutation={DELETE_HULL_TYPE}
            refetchQueries={["hullTypes"]}
          />
        </div>
      ),
    },
  ];

  const pageInfo = data?.hullTypes.pageInfo ?? {};

  return (
    <div>
      <div className={classes["options-wrapper"]}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
          />
        </div>
        <div className={classes["option"]}>
          <CreateHullType />
        </div>
      </div>
      <Table
        rowKey="id"
        dataSource={data?.hullTypes.edges.map((edge: { node: HullType }) => edge.node)}
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
