import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Divider, message, Modal, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { ASSIGN_USER_TO_LOCATION } from "../../../api/mutations";
import { GET_ALL_USERS } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import User from "../../../models/User";
import AssignmentTypeSelector from "../../common/AssignmentTypeSelector";
import { CenteredSpin } from "../../common/CenteredSpin";
import { SearchLocations } from "../../common/SearchLocations";
import { SearchUsers } from "../../common/SearchUsers";
import { DivisionSelector } from "../Division/DivisionSelector";
import { LocationSelector } from "./LocationSelector";
import Location from "../../../models/Location";

export interface LocationUserBulkAssignmentProps {}

export const LocationUserBulkAssignment: React.FC<
  LocationUserBulkAssignmentProps
> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [assignmentType, setAssignmentType] = useState<string | null>("Admin");
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [assignUserToLocation, { loading: assigning }] = useMutation(
    ASSIGN_USER_TO_LOCATION,
    {
      onCompleted: (data) => {
        message.success(data.assignUserToLocation);
      },
      onError: (err) => {
        errorMessage(err, "Unexpected error during user bulk assignment.");
      },
      refetchQueries: ["locationAssignments"],
    }
  );

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
        style={{ width: 156 }}
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
                    selectedLocations.filter((location) => location.id !== loc.id)
                  )
                }
                style={{ marginRight: ".5rem", marginTop: ".3rem" }}
              >
                {loc.name}
              </Tag>
            ))}
          </div>
        )}
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
        <SearchUsers
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
                selectedLocations?.length === 0 || selectedUsers?.length === 0
              }
              loading={assigning}
              className="primaryButton"
              onClick={() => {
                assignUserToLocation({
                  variables: {
                    input: {
                      userIds: selectedUsers.map((u) => u.id),
                      locationIds: selectedLocations.map((loc) => loc.id),
                      userType: assignmentType
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
