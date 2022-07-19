import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Empty, Modal, Row, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { ADD_CHECKLIST_TEMPLATE_ITEM } from "../../api/mutations";
import { ENTITY_CHECKLIST_TEMPLATE } from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import ChecklistTemplateItem from "../../models/ChecklistTemplateItem";
import Machine from "../../models/Machine";
import Transportation from "../../models/Transportation";
import { RemoveChecklistTemplateItem } from "./RemoveChecklistTemplateItem";
import { SaveAsTemplate } from "./SaveAsTemplate";
import { SelectChecklistTemplate } from "./SelectChecklistTemplate";

export interface EditChecklistTemplateProps {
  entity: Machine | Transportation;
  entityType: "Machine" | "Transportation";
  type: "Daily" | "Weekly";
}

export const EditChecklistTemplate: React.FC<EditChecklistTemplateProps> = ({
  entity,
  entityType,
  type,
}) => {
  const [visible, setVisible] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newItemAdded, setNewItemAdded] = useState(false);
  const newItemInput = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      getEntityTemplate({
        variables: {
          input: {
            entityId: entity.id,
            entityType,
            type,
          },
        },
      });
    }
  }, [visible]);

  const [getEntityTemplate, { loading: loadingDetails, data: details }] =
    useLazyQuery(ENTITY_CHECKLIST_TEMPLATE, {
      onCompleted: () => {
        if (newItemAdded) {
          newItemInput.current.focus();
          setNewItemAdded(false);
        }
      },
      onError: (error) => {
        errorMessage(error, "Error loading template.");
      },
      notifyOnNetworkStatusChange: true,
    });

  const handleCancel = () => {
    setVisible(false);
  };

  const [addItem, { loading: addingItem }] = useMutation(
    ADD_CHECKLIST_TEMPLATE_ITEM,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while adding item.");
      },
      refetchQueries: ["entityChecklistTemplate"],
    }
  );

  const submitNewItem = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") setNewItem("");
    else if (event.key === "Enter") {
      setNewItemAdded(true);
      event.preventDefault();
      if (newItem.trim() === "") return;
      setNewItem("");
      addItem({
        variables: {
          id: details.entityChecklistTemplate.id,
          name: newItem,
          entityType,
          entityId: entity.id,
        },
      });
    }
  };

  return (
    <>
      <FaEdit
        className="editButton"
        onClick={() => setVisible(true)}
        size="20px"
      />
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Edit ${type} Checklist: ${entity?.machineNumber}`}
        destroyOnClose={true}
      >
        {loadingDetails ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Spin />
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                {details?.entityChecklistTemplate.name &&
                  `Using template: ${details?.entityChecklistTemplate.name}`}
              </div>
              <SelectChecklistTemplate
                type={type}
                entity={entity}
                entityType={entityType}
              />
            </div>
            {details?.entityChecklistTemplate.items.length === 0 && <Empty />}
            {details?.entityChecklistTemplate.items.map(
              (item: ChecklistTemplateItem) => (
                <div key={item.id} style={{ marginBottom: ".25rem" }}>
                  <RemoveChecklistTemplateItem
                    item={item}
                    templateId={details?.entityChecklistTemplate.id}
                    entity={entity}
                    entityType={entityType}
                  />{" "}
                  {item.name}
                </div>
              )
            )}
            <input
              ref={newItemInput}
              type="text"
              placeholder={addingItem ? "Adding..." : "Add new item"}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={submitNewItem}
              disabled={addingItem}
              style={{
                border: "solid 1px #e5e5e5",
                borderRadius: 5,
                padding: ".5rem",
                width: "100%",
              }}
            />
            <div style={{ marginTop: ".5rem" }}>
              {!details?.entityChecklistTemplate.name &&
                details?.entityChecklistTemplate.items.length > 0 && (
                  <SaveAsTemplate id={details?.entityChecklistTemplate.id} />
                )}
            </div>
          </>
        )}
        <Row justify="end" gutter={16} style={{ marginTop: "1rem" }}>
          <Button
            type="ghost"
            onClick={handleCancel}
            className="secondaryButton"
          >
            Close
          </Button>
        </Row>
      </Modal>
    </>
  );
};
