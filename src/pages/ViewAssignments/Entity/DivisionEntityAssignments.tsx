import { useLazyQuery } from "@apollo/client";
import { Checkbox, message, Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UNASSIGN_USER_FROM_DIVISION } from "../../../api/mutations";
import { ALL_ENTITY, DIVISION_ASSIGNMENTS } from "../../../api/queries";
import { DeleteListing } from "../../../components/common/DeleteListing";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS, PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { hasPermissions } from "../../../helpers/permissions";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import User from "../../../models/User";
import moment from "moment";
import { SearchUsers } from "../../../components/common/SearchUsers";
import DivisionAssign from "../../../models/DivisionAssign";
import Division from "../../../models/Division";
import { SearchDivisions } from "../../../components/common/SearchDivisions";
import classes from "./DivisionEntityAssignments.module.css";
import { DivisionEntityBulkAssignment } from "../../../components/EntityComponents/EntityAssignment/DivisionEntityBulkAssignment";
import { Entity } from "../../../models/Entity/Entity";
import { EntityListing } from "../../../components/EntityComponents/EntityListing";
import EditEntityDivision from "./EditEntityDivision";

export interface DivisionEntityAssignmentsProps {}

export const DivisionEntityAssignments: React.FC<
  DivisionEntityAssignmentsProps
> = ({}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasPermissions(user, ["ASSIGN_TO_ENTITY"])) {
      navigate("/");
      message.error("No permission to view assignments.");
    }
  }, []);

  const [page, setPage] = useState(1);
  const [selectedDivisions, setSelectedDivisions] = useState<Division[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      divisionIds: number[];
      userIds: number[];
    }
  >({
    ...DefaultPaginationArgs,
    divisionIds: [],
    userIds: [],
  });

  const [getAllEntity, { data, loading }] = useLazyQuery(ALL_ENTITY, {
    onError: (err) => {
      errorMessage(err, "Error loading division assignments.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getAllEntity({ variables: filter });
  }, [filter, getAllEntity]);

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

  const columns: ColumnsType<Entity> = [
    {
      title: "Entity",
      dataIndex: "entity",
      key: "entity",
      render: (val, entity: Entity) => {
        console.log(val);
        return <EntityListing entity={entity} />;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (val, entity: Entity) => `${entity?.type?.name}`,
      className: classes["font"],
    },
    {
      title: "Division",
      dataIndex: "division",
      key: "division",
      render: (val, entity: Entity) =>
        `${entity?.division?.name ? entity?.division?.name : ""}`,
      className: classes["font"],
    },

    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
      render: (val, entity: Entity) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <EditEntityDivision entity={entity} />
        </div>
      ),
    },
  ];

  const pageInfo = data?.getAllEntity.pageInfo ?? {};

  const isSmallDevice = useIsSmallDevice(600, false);

  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem .5rem 0 0";

  useEffect(() => {
    setFilter({
      ...filter,
      divisionIds: selectedDivisions.map((s) => s.id),
    });
    setPage(1);
  }, [selectedDivisions]);

  useEffect(() => {
    setFilter({
      ...filter,
      userIds: selectedUsers.map((s) => s.id),
    });
    setPage(1);
  }, [selectedUsers]);

  return (
    <div>
      <div className={classes["options-wrapper"]}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: isSmallDevice ? "space-around" : undefined,
          }}
        >
          <SearchDivisions
            placeholder="Filter division"
            rounded
            current={selectedDivisions}
            onChange={(division) => {
              const current = selectedDivisions.map((s) => s.id);
              if (current.includes(division.id)) return;
              setSelectedDivisions([...selectedDivisions, division]);
            }}
            width={190}
            margin={filterMargin}
          />
          <SearchUsers
            placeholder="Filter user"
            rounded
            current={selectedUsers}
            onChange={(user) => {
              const current = selectedUsers.map((s) => s.id);
              if (current.includes(user.id)) return;
              setSelectedUsers([...selectedUsers, user]);
            }}
            width={190}
            margin={filterMargin}
          />
        </div>
        <div className={classes["option"]}>
          <DivisionEntityBulkAssignment />
        </div>
      </div>
      {selectedDivisions.length > 0 && (
        <div
          style={{
            display: "flex",
            opacity: 0.7,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {selectedDivisions.map((d) => (
            <Tag
              key={d.id}
              closable
              onClose={() =>
                setSelectedDivisions(
                  selectedDivisions.filter((s) => s.id !== d.id)
                )
              }
              style={{ marginRight: "1rem" }}
            >
              {d.name}
            </Tag>
          ))}
        </div>
      )}
      {selectedUsers.length > 0 && (
        <div
          style={{
            display: "flex",
            opacity: 0.7,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {selectedUsers.map((user) => (
            <Tag
              key={user.id}
              closable
              onClose={() =>
                setSelectedUsers(selectedUsers.filter((s) => s.id !== user.id))
              }
              style={{ marginRight: "1rem" }}
            >
              {user.fullName} ({user.rcno})
            </Tag>
          ))}
        </div>
      )}
      <Table
        rowKey="id"
        dataSource={data?.getAllEntity.edges.map(
          (edge: { node: Entity }) => edge.node
        )}
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
