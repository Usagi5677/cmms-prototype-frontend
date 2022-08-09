import React from "react";
import Checklist from "../../models/Checklist";
import ParsedEntityAttachment from "../EntityComponents/ParsedEntityAttachment/ParsedEntityAttachment";

export interface ChecklistAttachmentsProps {
  checklist: Checklist;
}

export const ChecklistAttachments: React.FC<ChecklistAttachmentsProps> = ({
  checklist,
}) => {
  return (
    <div
      style={{
        display: "flex",
        maxHeight: 250,
        overflowY: "auto",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      {checklist.attachments.map((attachment) => (
        <div
          key={attachment.id}
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
        >
          <ParsedEntityAttachment
            attachmentData={attachment}
            checklistView={true}
          />
        </div>
      ))}
    </div>
  );
};
