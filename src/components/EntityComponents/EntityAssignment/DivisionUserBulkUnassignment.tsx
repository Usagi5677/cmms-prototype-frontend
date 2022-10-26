import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Divider, message, Modal, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { BULK_UNASSIGN_USER_FROM_DIVISION } from "../../../api/mutations";
import { GET_ALL_USERS } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import User from "../../../models/User";
import { CenteredSpin } from "../../common/CenteredSpin";
import { SearchUsers } from "../../common/SearchUsers";
import { DivisionSelector } from "../../Config/Division/DivisionSelector";
import { LocationSelector } from "../../Config/Location/LocationSelector";

export interface DivisionUserBulkUnassignmentProps {}

export const DivisionUserBulkUnassignment: React.FC<
  DivisionUserBulkUnassignmentProps
> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [divisionIds, setDivisionIds] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [bulkUnassignUserFromDivision, { loading: assigning }] = useMutation(
    BULK_UNASSIGN_USER_FROM_DIVISION,
    {
      onCompleted: (data) => {
        message.success(data.bulkUnassignUserFromDivision);
      },
      onError: (err) => {
        errorMessage(err, "Unexpected error during user bulk unassignment.");
      },
      refetchQueries: ["divisionAssignments"],
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
    setVisible(false);
  };

  useEffect(() => {
    setSelectedUsers([]);
  }, []);

  return (
    <div>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        className="primaryButton"
        style={{ width: 156, marginTop: 10 }}
      >
        Bulk Unassignment
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Bulk Unassignment"
        bodyStyle={{ paddingTop: "1rem" }}
      >
        <Divider style={{ marginTop: 0 }} orientation="left">
          Division
        </Divider>
        <DivisionSelector
          setDivisionId={setDivisionIds}
          currentId={divisionIds}
          width="100%"
          rounded={false}
        />
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
                divisionIds?.length === 0 || selectedUsers?.length === 0
              }
              loading={assigning}
              className="primaryButton"
              onClick={() => {
                bulkUnassignUserFromDivision({
                  variables: {
                    input: {
                      userIds: selectedUsers.map((u) => u.id),
                      divisionId: divisionIds,
                    },
                  },
                });
              }}
            >
              Unassign
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
