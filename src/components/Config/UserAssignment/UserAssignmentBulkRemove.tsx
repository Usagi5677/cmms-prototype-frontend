import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Divider, message, Modal, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { USER_ASSIGNMENT_BULK_REMOVE } from "../../../api/mutations";
import { GET_ALL_USERS } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import Location from "../../../models/Location";
import User from "../../../models/User";
import AssignmentTypeSelector from "../../common/AssignmentTypeSelector";
import { CenteredSpin } from "../../common/CenteredSpin";
import { SearchLocations } from "../../common/SearchLocations";
import { SearchUsersWithPermissions } from "../../common/SearchUsersWithPermissions";
import { DivisionSelector } from "../Division/DivisionSelector";
import { LocationSelector } from "../Location/LocationSelector";
import { ZoneSelector } from "../Zone/ZoneSelector";

export interface BulkAssignmentProps {}

export const UserAssignmentBulkRemove: React.FC<BulkAssignmentProps> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [assignmentType, setAssignmentType] = useState<string | null>("Admin");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [zoneId, setZoneId] = useState<number | null>(null);

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

  const [bulkRemove, { loading: assigning }] = useMutation(
    USER_ASSIGNMENT_BULK_REMOVE,
    {
      onCompleted: (data) => {
        message.success(data.bulkRemoveUserAssignment);
      },
      onError: (err) => {
        errorMessage(err, "Unexpected error during bulk remove.");
      },
      refetchQueries: ["userAssignments"],
    }
  );

  const handleCancel = () => {
    setSelectedUsers([]);
    setSelectedLocations([]);
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
        Bulk Remove
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Bulk Remove"
        bodyStyle={{ paddingTop: "1rem" }}
      >
        <Divider style={{ marginTop: 0 }} orientation="left">
          Assignment Type
        </Divider>
        <AssignmentTypeSelector
          value={assignmentType}
          width="100%"
          rounded={false}
          onChange={(type) => setAssignmentType(type)}
        />
        <Divider orientation="left">Zone</Divider>
        <ZoneSelector setZoneId={setZoneId} width="100%" />
        <Divider orientation="left">
          Location
          {selectedLocations.length > 0 && (
            <Tag
              style={{ marginLeft: "1rem", cursor: "pointer" }}
              closable
              onClick={() => setSelectedLocations([])}
              onClose={() => setSelectedLocations([])}
            >
              Clear all locations
            </Tag>
          )}
        </Divider>
        <SearchLocations
          current={selectedLocations}
          onChange={(loc) => {
            const current = selectedLocations.map((location) => location.id);
            if (current.includes(loc.id)) return;
            setSelectedLocations([...selectedLocations, loc]);
          }}
        />
        {selectedLocations.length > 0 && (
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
            {selectedLocations.map((loc) => (
              <Tag
                key={loc.id}
                closable
                onClose={() =>
                  setSelectedLocations(
                    selectedLocations.filter(
                      (location) => location.id !== loc.id
                    )
                  )
                }
                style={{ marginRight: ".5rem", marginTop: ".3rem" }}
              >
                {loc.name}
              </Tag>
            ))}
          </div>
        )}
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
                    variables: {
                      first: 1000,
                      divisionIds: [divisionId],
                      type: assignmentType,
                    },
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
                    variables: {
                      first: 1000,
                      locationIds: [locationId],
                      type: assignmentType,
                    },
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
              disabled={selectedUsers?.length === 0}
              loading={assigning}
              className="primaryButton"
              style={{ width: 156 }}
              onClick={() => {
                bulkRemove({
                  variables: {
                    input: {
                      type: assignmentType,
                      userIds: selectedUsers.map((u) => u.id),
                      locationIds: selectedLocations.map((loc) => loc.id),
                      zoneId,
                    },
                  },
                });
              }}
            >
              Remove
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
