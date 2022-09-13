import { useLazyQuery } from "@apollo/client";
import { Checkbox, message, Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UNASSIGN_USER_FROM_ENTITY } from "../api/mutations";
import { ASSIGNMENTS } from "../api/queries";
import { DeleteListing } from "../components/common/DeleteListing";
import PaginationButtons from "../components/common/PaginationButtons/PaginationButtons";
import { EntityListing } from "../components/EntityComponents/EntityListing";
import UserContext from "../contexts/UserContext";
import { DATETIME_FORMATS, PAGE_LIMIT } from "../helpers/constants";
import { errorMessage } from "../helpers/gql";
import { hasPermissions } from "../helpers/permissions";
import { useIsSmallDevice } from "../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../models/DefaultPaginationArgs";
import { Entity } from "../models/Entity/Entity";
import EntityAssignment from "../models/Entity/EntityAssign";
import PaginationArgs from "../models/PaginationArgs";
import User from "../models/User";
import moment from "moment";
import { SearchEntities } from "../components/common/SearchEntitities";
import AssignmentTypeSelector from "../components/common/AssignmentTypeSelector";
import { SearchUsers } from "../components/common/SearchUsers";
import { BulkAssignment } from "../components/EntityComponents/EntityAssignment/BulkAssignment";

export interface AssignmentsProps {}

export const Assignments: React.FC<AssignmentsProps> = ({}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasPermissions(user, ["ASSIGN_TO_ENTITY"])) {
      navigate("/");
      message.error("No permission to view assignments.");
    }
  }, []);

  const [page, setPage] = useState(1);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      entityIds: number[];
      userIds: number[];
      type: string | null;
      current: boolean;
    }
  >({
    ...DefaultPaginationArgs,
    entityIds: [],
    userIds: [],
    type: null,
    current: true,
  });

  const [getAssignments, { data, loading }] = useLazyQuery(ASSIGNMENTS, {
    onError: (err) => {
      errorMessage(err, "Error loading assignments.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getAssignments({ variables: filter });
  }, [filter, getAssignments]);

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

  const columns: ColumnsType<EntityAssignment> = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: User) => `${user.fullName} (${user.rcno})`,
    },
    {
      title: "Entity",
      dataIndex: "entity",
      key: "entity",
      render: (entity: Entity) => <EntityListing entity={entity} />,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "From",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        moment(createdAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR),
    },

    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (val, assignment: EntityAssignment) =>
        assignment.removedAt ? null : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <DeleteListing
              id={assignment.id}
              mutation={UNASSIGN_USER_FROM_ENTITY}
              refetchQueries={["assignments"]}
              tooltip="Unassign"
              title="Are you sure to unassign?"
              variables={{
                entityId: assignment.entity.id,
                type: assignment.type,
                userId: assignment.user.id,
              }}
            />
          </div>
        ),
    },
  ];

  if (!filter.current) {
    columns.splice(4, 0, {
      title: "To",
      dataIndex: "removedAt",
      key: "removedAt",
      render: (removedAt) =>
        removedAt
          ? moment(removedAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
          : null,
    });
  }

  const pageInfo = data?.assignments.pageInfo ?? {};

  const isSmallDevice = useIsSmallDevice();

  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  useEffect(() => {
    setFilter({
      ...filter,
      entityIds: selectedEntities.map((s) => s.id),
    });
    setPage(1);
  }, [selectedEntities]);

  useEffect(() => {
    setFilter({
      ...filter,
      userIds: selectedUsers.map((s) => s.id),
    });
    setPage(1);
  }, [selectedUsers]);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "var(--card-bg)",
        borderRadius: 20,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: 10,
        border: "var(--card-border)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: isSmallDevice ? "space-around" : undefined,
            margin: "-.5rem 1rem 0 0",
          }}
        >
          <SearchEntities
            placeholder="Filter entity"
            rounded
            current={selectedEntities}
            onChange={(entity) => {
              const current = selectedEntities.map((s) => s.id);
              if (current.includes(entity.id)) return;
              setSelectedEntities([...selectedEntities, entity]);
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
          <AssignmentTypeSelector
            margin={filterMargin}
            value={filter.type}
            width={190}
            onChange={(type) => {
              setFilter({ ...filter, type });
              setPage(1);
            }}
          />
          <Checkbox
            style={{ margin: filterMargin }}
            checked={filter.current}
            onChange={(e) => {
              setFilter({ ...filter, current: e.target.checked });
              setPage(1);
            }}
          >
            Active assignments only
          </Checkbox>
        </div>
        <BulkAssignment />
      </div>
      {selectedEntities.length > 0 && (
        <div
          style={{
            display: "flex",
            opacity: 0.7,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {selectedEntities.map((entity) => (
            <Tag
              key={entity.id}
              closable
              onClose={() =>
                setSelectedEntities(
                  selectedEntities.filter((s) => s.id !== entity.id)
                )
              }
              style={{ marginRight: "1rem" }}
            >
              {entity.machineNumber} ({entity.location?.name})
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
        dataSource={data?.assignments.edges.map(
          (edge: { node: Location }) => edge.node
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
