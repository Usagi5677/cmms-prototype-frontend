import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Divider, message, Modal, Row, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { FaUserCog } from "react-icons/fa";
import { ASSIGN_USER_TO_DIVISION } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Division from "../../../models/Division";
import DivisionAssign from "../../../models/DivisionAssign";
import User from "../../../models/User";
import AssignmentTypeSelector from "../../common/AssignmentTypeSelector";
import { SearchUsersWithPermissions } from "../../common/SearchUsersWithPermissions";

export interface DivisionUserProps {
  division: Division;
}

export const DivisionUserAssignment: React.FC<DivisionUserProps> = ({
  division,
}) => {
  const [visible, setVisible] = useState(false);
  const [assignmentType, setAssignmentType] = useState<string | null>("Admin");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [assignToDivision, { loading: assigning }] = useMutation(
    ASSIGN_USER_TO_DIVISION,
    {
      onCompleted: (data) => {
        message.success("Successfully assigned to division");
      },
      onError: (err) => {
        errorMessage(
          err,
          "Unexpected error during assigning user to division."
        );
      },
      refetchQueries: ["getAllUsersOfDivision"],
    }
  );

  useEffect(() => {
    division.assignees?.map((e: DivisionAssign) => {
      selectedUsers.push(e?.user!);
    });
  }, [division]);

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Tooltip title="Edit" placement="top">
        <FaUserCog
          className="editButton"
          onClick={() => setVisible(true)}
          style={{ marginRight: ".5rem" }}
          // size="20px"
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Assign User"
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
              current={selectedUsers as unknown as User[]}
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
                {selectedUsers.map((da) => (
                  <Tag
                    key={da?.id}
                    closable
                    onClose={() =>
                      setSelectedUsers(
                        selectedUsers.filter((s) => {
                          return s?.id !== da?.id;
                        })
                      )
                    }
                    style={{ marginRight: ".5rem", marginTop: ".3rem" }}
                  >
                    {da?.fullName} ({da?.rcno})
                  </Tag>
                ))}
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
              loading={assigning}
              className="primaryButton"
              onClick={() => {
                let userIds = selectedUsers.map((u) => u.id);
                assignToDivision({
                  variables: {
                    input: {
                      userIds: userIds,
                      divisionId: division.id,
                    },
                  },
                });
                setVisible(false);
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
