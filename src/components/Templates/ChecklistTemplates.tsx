import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CHECKLIST_TEMPLATES } from "../../api/queries";
import { PAGE_LIMIT } from "../../helpers/constants";
import { errorMessage } from "../../helpers/gql";
import ChecklistTemplate from "../../models/ChecklistTemplate";
import DefaultPaginationArgs from "../../models/DefaultPaginationArgs";
import PaginationArgs from "../../models/PaginationArgs";
import PaginationButtons from "../common/PaginationButtons/PaginationButtons";
import Search from "../common/Search";
import ChecklistTemplateTypeFilter from "./ChecklistTemplateTypeFilter";
import type { ColumnsType } from "antd/es/table";
import { CreateChecklistTemplate } from "./CreateChecklistTemplate";
import { DeleteListing } from "../common/DeleteListing";
import { DELETE_CHECKLIST_TEMPLATE } from "../../api/mutations";
import { ChecklistTemplateDetails } from "./ChecklistTemplateDetails";
import { hasPermissions, isAssignedType } from "../../helpers/permissions";
import UserContext from "../../contexts/UserContext";
import classes from "./Templates.module.css";

export interface ChecklistTemplatesProps {}

export const ChecklistTemplates: React.FC<ChecklistTemplatesProps> = ({}) => {
  const { user } = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      type: string | null;
    }
  >({
    ...DefaultPaginationArgs,
    search: "",
    type: null,
  });

  const [getChecklistTemplates, { data, loading }] = useLazyQuery(
    CHECKLIST_TEMPLATES,
    {
      onError: (err) => {
        errorMessage(err, "Error loading checklist templates.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    getChecklistTemplates({ variables: filter });
  }, [filter, getChecklistTemplates]);

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

  const columns: ColumnsType<ChecklistTemplate> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "50%",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "50%",
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
            <ChecklistTemplateDetails checklistTemplate={rec} />
          </div>
          <DeleteListing
            id={rec.id}
            mutation={DELETE_CHECKLIST_TEMPLATE}
            refetchQueries={["checklistTemplates"]}
          />
        </div>
      ),
    });
  }

  const pageInfo = data?.checklistTemplates.pageInfo ?? {};

  return (
    <div>
      <div className={classes["option-container"]}>
        <div className={classes["option-wrapper"]}>
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
          />
          <ChecklistTemplateTypeFilter
            onChange={(type) => {
              setFilter({ ...filter, type, ...DefaultPaginationArgs });
            }}
            value={filter.type}
          />
        </div>
        {hasPermissions(user, ["MODIFY_TEMPLATES"]) && (
          <CreateChecklistTemplate />
        )}
      </div>
      <Table
        rowKey="id"
        dataSource={data?.checklistTemplates.edges.map(
          (edge: { node: ChecklistTemplate }) => edge.node
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
