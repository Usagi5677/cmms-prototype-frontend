import { useMutation } from "@apollo/client";
import { Input } from "antd";
import React, { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { ADD_CHECKLIST_COMMENT } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import Checklist from "../../models/Checklist";
import { ChecklistComment } from "./ChecklistComment";

export interface ChecklistCommentsProps {
  checklist: Checklist;
}

export const ChecklistComments: React.FC<ChecklistCommentsProps> = ({
  checklist,
}) => {
  const [newItem, setNewItem] = useState("");

  const [addItem, { loading: addingItem }] = useMutation(
    ADD_CHECKLIST_COMMENT,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while adding item.");
      },
      refetchQueries: ["checklist", "checklistSummary"],
    }
  );

  const submitNewItem = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") setNewItem("");
    else if (event.key === "Enter") {
      // setNewItemAdded(true);
      event.preventDefault();
      if (newItem.trim() === "") return;
      setNewItem("");
      addItem({
        variables: {
          checklistId: checklist.id,
          comment: newItem,
        },
      });
    }
  };
  const onBtnClick = () => {
    if (newItem.trim() === "") return;
    setNewItem("");
    addItem({
      variables: {
        checklistId: checklist.id,
        comment: newItem,
      },
    });
  };
  return (
    <>
      <Input.Group compact style={{ display: "flex" }}>
        <Input
          type="text"
          placeholder={addingItem ? "Adding..." : "Add comment"}
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
      <div>
        {checklist?.comments.map((comment) => (
          <ChecklistComment key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  );
};
