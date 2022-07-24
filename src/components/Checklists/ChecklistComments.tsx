import { useMutation } from "@apollo/client";
import React, { useState } from "react";
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
      refetchQueries: ["checklist"],
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

  return (
    <div>
      <input
        // ref={newItemInput}
        type="text"
        placeholder={addingItem ? "Adding..." : "Add comment"}
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
      <div>
        {checklist?.comments.map((comment) => (
          <ChecklistComment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
