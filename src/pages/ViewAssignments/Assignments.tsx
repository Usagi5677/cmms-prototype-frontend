import { useLazyQuery } from "@apollo/client";
import { Checkbox, message, Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UNASSIGN_USER_FROM_ENTITY } from "../../api/mutations";
import { ASSIGNMENTS } from "../../api/queries";
import { DeleteListing } from "../../components/common/DeleteListing";
import PaginationButtons from "../../components/common/PaginationButtons/PaginationButtons";
import { EntityListing } from "../../components/EntityComponents/EntityListing";
import UserContext from "../../contexts/UserContext";
import { DATETIME_FORMATS, PAGE_LIMIT } from "../../helpers/constants";
import { errorMessage } from "../../helpers/gql";
import { hasPermissions } from "../../helpers/permissions";
import DefaultPaginationArgs from "../../models/DefaultPaginationArgs";
import { Entity } from "../../models/Entity/Entity";
import EntityAssignment from "../../models/Entity/EntityAssign";
import PaginationArgs from "../../models/PaginationArgs";
import User from "../../models/User";
import moment from "moment";
import { SearchEntities } from "../../components/common/SearchEntitities";
import AssignmentTypeSelector from "../../components/common/AssignmentTypeSelector";
import { SearchUsers } from "../../components/common/SearchUsers";
import { BulkAssignment } from "../../components/EntityComponents/EntityAssignment/BulkAssignment";
import classes from "./Assignments.module.css";
import { BulkUnassignment } from "../../components/EntityComponents/EntityAssignment/BulkUnassignment";

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
      className: classes["font"],
    },
    {
      title: "Entity",
      dataIndex: "entity",
      key: "entity",
      render: (entity: Entity) => <EntityListing entity={entity} />,
      className: classes["font"],
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      className: classes["font"],
    },
    {
      title: "From",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        moment(createdAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR),
      className: classes["font"],
    },

    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
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
          />
          <AssignmentTypeSelector
            value={filter.type}
            width={190}
            onChange={(type) => {
              setFilter({ ...filter, type });
              setPage(1);
            }}
          />
          <Checkbox
            checked={filter.current}
            onChange={(e) => {
              setFilter({ ...filter, current: e.target.checked });
              setPage(1);
            }}
          >
            Active assignments only
          </Checkbox>
        </div>
        <div className={classes["option"]}>
          <BulkAssignment />
          <BulkUnassignment />
        </div>
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
