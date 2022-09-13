import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import {
  REMOVE_REPAIR,
  REMOVE_REPAIR_COMMENT,
} from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Comment from "../../../models/Comment";
import Repair from "../../../models/Entity/Repair";
import { CommentCard } from "../../common/CommentCard/CommentCard";

import { AddRepairComment } from "../AddRepairComment";
import classes from "./RepairDetailCard.module.css";
const RepairDetailCard = ({
  index,
  repair,
  isDeleted,
}: {
  index: number;
  repair: Repair;
  isDeleted?: boolean;
}) => {
  const [hover, setHover] = useState(false);
  const [removeRepair, { loading }] = useMutation(
    REMOVE_REPAIR,
    {
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while removing repair detail."
        );
      },
      refetchQueries: [
        "repairs",
        "breakdowns",
        "getAllHistoryOfEntity",
      ],
    }
  );
  return (
    <div className={classes["container"]}>
      <div
        className={classes["repair-detail"]}
        key={repair.id}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={classes["repair-description"]}>
          <span className={classes["number"]}>{index + 1}.</span>
          <div className={classes["description-wrapper"]}>
            <div style={{ fontSize: 14 }}>{repair.name}</div>
            <div style={{ opacity: 0.5, fontSize: 12 }}>
              {repair.createdBy.fullName} ({repair.createdBy.rcno})
            </div>
          </div>
          {hover && (
            <AddRepairComment repair={repair} isDeleted={isDeleted} />
          )}
        </div>
        <CloseCircleOutlined
          style={{ color: "red" }}
          onClick={() => {
            removeRepair({
              variables: {
                id: repair.id,
              },
            });
          }}
        />
      </div>
      {repair?.comments?.map((c: Comment) => (
        <CommentCard
          comment={c}
          isRemark
          key={c.id}
          isDeleted={isDeleted}
          mutation={REMOVE_REPAIR_COMMENT}
          refetchQueries={["repairs", "getAllHistoryOfEntity", "breakdowns"]}
        />
      ))}
    </div>
  );
};

export default RepairDetailCard;
