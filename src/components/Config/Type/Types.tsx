import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { TYPES } from "../../../api/queries";
import { PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import PaginationButtons from "../../common/PaginationButtons/PaginationButtons";
import Search from "../../common/Search";
import type { ColumnsType } from "antd/es/table";
import { DeleteListing } from "../../common/DeleteListing";
import { DELETE_TYPE } from "../../../api/mutations";
import Type from "../../../models/Type";
import { CreateType } from "./CreateType";
import EntityTypeFilter from "./EntityTypeFilter";
import { EditType } from "./EditType";
import classes from "./Types.module.css";

export interface TypesProps {}

export const Types: React.FC<TypesProps> = ({}) => {
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      name: string;
      entityType: string | null;
    }
  >({
    ...DefaultPaginationArgs,
    name: "",
    entityType: null,
  });

  const [getTypes, { data, loading }] = useLazyQuery(TYPES, {
    onError: (err) => {
      errorMessage(err, "Error loading types.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    getTypes({ variables: filter });
  }, [filter, getTypes]);

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

  const columns: ColumnsType<Type> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "50%",
      className: classes["font"],
    },
    {
      title: "Type",
      dataIndex: "entityType",
      key: "entityType",
      width: "50%",
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
          <EditType type={rec} />
          <DeleteListing
            id={rec.id}
            mutation={DELETE_TYPE}
            refetchQueries={["types"]}
          />
        </div>
      ),
    },
  ];

  const pageInfo = data?.types.pageInfo ?? {};

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
          <EntityTypeFilter
            onChange={(entityType) => {
              setFilter({ ...filter, entityType, ...DefaultPaginationArgs });
            }}
            value={filter.entityType}
          />
        </div>
        <div className={classes["option"]}>
          <CreateType />
        </div>
      </div>
      <Table
        rowKey="id"
        dataSource={data?.types.edges.map((edge: { node: Type }) => edge.node)}
        columns={columns}
        pagination={false}
        size="small"
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
