import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Divider, message, Modal, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { BULK_ASSIGN } from "../../../api/mutations";
import { ALL_ENTITY, GET_ALL_USERS } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import User from "../../../models/User";
import AssignmentTypeSelector from "../../common/AssignmentTypeSelector";
import { CenteredSpin } from "../../common/CenteredSpin";
import { SearchEntities } from "../../common/SearchEntitities";
import { SearchUsersWithPermissions } from "../../common/SearchUsersWithPermissions";
import { DivisionSelector } from "../../Config/Division/DivisionSelector";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { ZoneSelector } from "../../Config/Zone/ZoneSelector";

export interface BulkAssignmentProps {}

export const BulkAssignment: React.FC<BulkAssignmentProps> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [assignmentType, setAssignmentType] = useState<string | null>("Admin");
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [getEntities, { loading: loadingEntities }] = useLazyQuery(ALL_ENTITY, {
    onCompleted: (data) => {
      const currentIds = selectedEntities.map((e) => e.id);
      const entities: Entity[] = data.getAllEntity.edges.map(
        (edge: { node: Entity }) => edge.node
      );
      const newEntities = entities.filter((e) => !currentIds.includes(e.id));
      setSelectedEntities([...selectedEntities, ...newEntities]);
    },
    onError: (err) => {
      errorMessage(err, "Error loading entities.");
    },
  });

  const [getUsers, { loading: loadingUsers }] = useLazyQuery(GET_ALL_USERS, {
    onCompleted: (data) => {
      const currentIds = selectedUsers.map((e) => e.id);
      const users: User[] = data.getAllUsers.edges.map(
        (edge: { node: User }) => edge.node
      );
      const newUsers = users.filter((e) => !currentIds.includes(e.id));
      setSelectedUsers([...selectedUsers, ...newUsers]);
    },
    onError: (err) => {
      errorMessage(err, "Error loading users.");
    },
  });

  const [bulkAssign, { loading: assigning }] = useMutation(BULK_ASSIGN, {
    onCompleted: (data) => {
      message.success(data.bulkAssign);
    },
    onError: (err) => {
      errorMessage(err, "Unexpected error during bulk assignment.");
    },
    refetchQueries: ["assignments"],
  });

  const handleCancel = () => {
    setSelectedUsers([]);
    setSelectedEntities([]);
    setVisible(false);
  };

  useEffect(() => {
    setSelectedUsers([]);
  }, [assignmentType]);

  return (
    <div>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        className="primaryButton"
      >
        Bulk Assignment
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Bulk Assignment"
        bodyStyle={{ paddingTop: "1rem" }}
      >
        <Divider style={{ marginTop: 0 }} orientation="left">
          Assignment type
        </Divider>
        <AssignmentTypeSelector
          value={assignmentType}
          width="100%"
          rounded={false}
          onChange={(type) => setAssignmentType(type)}
        />
        {assignmentType && (
          <>
            <Divider orientation="left">
              Users
              {selectedUsers.length > 0 && (
                <Tag
                  style={{ marginLeft: "1rem", cursor: "pointer" }}
                  closable
                  onClick={() => setSelectedUsers([])}
                  onClose={() => setSelectedUsers([])}
                >
                  Clear all users
                </Tag>
              )}
            </Divider>
            <SearchUsersWithPermissions
              type={assignmentType}
              current={selectedUsers}
              onChange={(user) => {
                const current = selectedUsers.map((s) => s.id);
                if (current.includes(user.id)) return;
                setSelectedUsers([...selectedUsers, user]);
              }}
            />
            <div style={{ marginTop: ".5rem" }}>
              <DivisionSelector
                onChange={(divisionId, clear) => {
                  getUsers({
                    variables: { first: 1000, divisionIds: [divisionId] },
                  });
                  clear();
                }}
                placeholder="Select all from division"
                width="100%"
              />
            </div>
            <div style={{ marginTop: ".5rem" }}>
              <LocationSelector
                onChange={(locationId, clear) => {
                  getUsers({
                    variables: { first: 1000, locationIds: [locationId] },
                  });
                  clear();
                }}
                placeholder="Select all from location"
                width="100%"
              />
            </div>
            {selectedUsers.length > 0 && (
              <div
                style={{
                  display: "flex",
                  opacity: 0.7,
                  marginTop: 10,
                  flexWrap: "wrap",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {selectedUsers.map((user) => (
                  <Tag
                    key={user.id}
                    closable
                    onClose={() =>
                      setSelectedUsers(
                        selectedUsers.filter((s) => s.id !== user.id)
                      )
                    }
                    style={{ marginRight: ".5rem", marginTop: ".3rem" }}
                  >
                    {user.fullName} ({user.rcno})
                  </Tag>
                ))}
                {loadingUsers && <CenteredSpin />}
              </div>
            )}
            <Divider orientation="left">
              Entities
              {selectedEntities.length > 0 && (
                <Tag
                  style={{ marginLeft: "1rem", cursor: "pointer" }}
                  closable
                  onClick={() => setSelectedEntities([])}
                  onClose={() => setSelectedEntities([])}
                >
                  Clear all entities
                </Tag>
              )}
            </Divider>
            <SearchEntities
              placeholder="Select entity"
              current={selectedEntities}
              onChange={(entity) => {
                const current = selectedEntities.map((s) => s.id);
                if (current.includes(entity.id)) return;
                setSelectedEntities([...selectedEntities, entity]);
              }}
            />
            <div style={{ marginTop: ".5rem" }}>
              <ZoneSelector
                onChange={(zoneId, clear) => {
                  getEntities({
                    variables: { first: 1000, zoneIds: [zoneId] },
                  });
                  clear();
                }}
                placeholder="Select all from zone"
                width="100%"
              />
            </div>
            <div style={{ marginTop: ".5rem" }}>
              <LocationSelector
                onChange={(locationId, clear) => {
                  getEntities({
                    variables: { first: 1000, locationIds: [locationId] },
                  });
                  clear();
                }}
                placeholder="Select all from location"
                width="100%"
              />
            </div>
            <div
              style={{
                display: "flex",
                opacity: 0.7,
                marginTop: 10,
                flexWrap: "wrap",
                maxHeight: 200,
                overflowY: "auto",
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
                  style={{ marginRight: ".5rem", marginTop: ".3rem" }}
                >
                  {entity.machineNumber} ({entity.location?.name})
                </Tag>
              ))}
              {loadingEntities && <CenteredSpin />}
            </div>
          </>
        )}
        <Row justify="end" gutter={16} style={{ marginTop: "1rem" }}>
          <Col>
            <Button
              type="ghost"
              onClick={handleCancel}
              className="secondaryButton"
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              disabled={
                selectedEntities.length === 0 || selectedUsers.length === 0
              }
              loading={assigning}
              className="primaryButton"
              onClick={() => {
                bulkAssign({
                  variables: {
                    input: {
                      type: assignmentType,
                      userIds: selectedUsers.map((u) => u.id),
                      entityIds: selectedEntities.map((e) => e.id),
                    },
                  },
                });
              }}
            >
              Assign
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
