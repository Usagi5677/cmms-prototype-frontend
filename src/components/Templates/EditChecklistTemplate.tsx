import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Empty, Input, Modal, Row, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaLocationArrow } from "react-icons/fa";
import { ADD_CHECKLIST_TEMPLATE_ITEM } from "../../api/mutations";
import { ENTITY_CHECKLIST_TEMPLATE } from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import ChecklistTemplateItem from "../../models/ChecklistTemplateItem";
import { Entity } from "../../models/Entity/Entity";
import { RemoveChecklistTemplateItem } from "./RemoveChecklistTemplateItem";
import { SaveAsTemplate } from "./SaveAsTemplate";
import { SelectChecklistTemplate } from "./SelectChecklistTemplate";

export interface EditChecklistTemplateProps {
  entity: Entity;
  type: "Daily" | "Weekly";
}

export const EditChecklistTemplate: React.FC<EditChecklistTemplateProps> = ({
  entity,
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
      refetchQueries: ["entityChecklistTemplate", "checklist"],
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
          entityId: entity.id,
        },
      });
    }
  };
  const onBtnClick = () => {
    if (newItem.trim() === "") return;
    setNewItem("");
    addItem({
      variables: {
        id: details.entityChecklistTemplate.id,
        name: newItem,
        entityId: entity.id,
      },
    });
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
              <SelectChecklistTemplate type={type} entity={entity} />
            </div>
            {details?.entityChecklistTemplate.items.length === 0 && <Empty />}
            {details?.entityChecklistTemplate.items.map(
              (item: ChecklistTemplateItem) => (
                <div key={item.id} style={{ marginBottom: ".25rem" }}>
                  <RemoveChecklistTemplateItem
                    item={item}
                    templateId={details?.entityChecklistTemplate.id}
                    entity={entity}
                  />{" "}
                  {item.name}
                </div>
              )
            )}

            <Input.Group compact style={{ display: "flex" }}>
              <Input
                ref={newItemInput}
                type="text"
                placeholder={addingItem ? "Adding..." : "Add new item"}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={submitNewItem}
                disabled={addingItem}
                style={{
                  borderRadius: 5,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              />
              <div
                style={{
                  backgroundColor: "var(--ant-primary-color)",
                  color: "white",
                  height: 36,
                  width: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: addingItem ? "not-allowed" : "pointer",
                  borderRadius: 5,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                onClick={() => onBtnClick()}
              >
                <FaLocationArrow />
              </div>
            </Input.Group>
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
