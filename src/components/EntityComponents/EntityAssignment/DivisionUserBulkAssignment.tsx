import { useMutation } from "@apollo/client";
import { Button, Col, Divider, message, Modal, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { ASSIGN_USER_TO_DIVISION, BULK_ASSIGN } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import User from "../../../models/User";
import { SearchUsers } from "../../common/SearchUsers";
import { DivisionSelector } from "../../Config/Division/DivisionSelector";

export interface DivisionUserBulkAssignmentProps {}

export const DivisionUserBulkAssignment: React.FC<
  DivisionUserBulkAssignmentProps
> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [divisionIds, setDivisionIds] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [userToDivisionAssign, { loading: assigning }] = useMutation(
    ASSIGN_USER_TO_DIVISION,
    {
      onCompleted: (data) => {
        message.success("Successfully assigned");
      },
      onError: (err) => {
        errorMessage(err, "Unexpected error during user bulk assignment.");
      },
      refetchQueries: ["divisionAssignments"],
    }
  );

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
                userToDivisionAssign({
                  variables: {
                    input: {
                      userIds: selectedUsers.map((u) => u.id),
                      divisionId: divisionIds,
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
