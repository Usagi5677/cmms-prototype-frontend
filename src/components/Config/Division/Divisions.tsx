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
import { DIVISIONS } from "../../../api/queries";
import { EditDivision } from "./EditDivision";
import { DELETE_DIVISION } from "../../../api/mutations";
import { CreateDivision } from "./CreateDivision";
import Division from "../../../models/Division";
import { DivisionUserAssignment } from "./DivisionUserAssignment";

export interface DivisionsProps {}

export const Divisions: React.FC<DivisionsProps> = ({}) => {
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

  const [getDivisions, { data, loading }] = useLazyQuery(DIVISIONS, {
    onError: (err) => {
      errorMessage(err, "Error loading divisions.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getDivisions({ variables: filter });
  }, [filter, getDivisions]);

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

  const columns: ColumnsType<Division> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (val, rec) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <EditDivision division={rec} />
          <DeleteListing
            id={rec.id}
            mutation={DELETE_DIVISION}
            refetchQueries={["divisions"]}
          />
        </div>
      ),
    },
  ];

  const pageInfo = data?.divisions.pageInfo ?? {};

  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        <div style={{ display: "flex" }}>
          <CreateDivision />
        </div>
      </div>
      <Table
        rowKey="id"
        dataSource={data?.divisions.edges.map((edge: { node: Division }) => edge.node)}
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
