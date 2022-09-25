import { CloseCircleOutlined, ToolOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { REMOVE_REPAIR, REMOVE_REPAIR_COMMENT } from "../../../api/mutations";
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
  hasPermission,
}: {
  index: number;
  repair: Repair;
  isDeleted?: boolean;
  hasPermission?: boolean;
}) => {
  const [hover, setHover] = useState(false);
  const [removeRepair, { loading }] = useMutation(REMOVE_REPAIR, {
    onError: (error) => {
      errorMessage(error, "Unexpected error while removing repair detail.");
    },
    refetchQueries: ["repairs", "breakdowns", "getAllHistoryOfEntity"],
  });
  return (
    <div className={classes["container"]}>
      <div
        className={classes["repair-detail"]}
        key={repair.id}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={classes["repair-description"]}>
          <div className={classes["description-wrapper"]}>
            <div style={{ fontSize: 14 }}>{repair.name}</div>
            <div className={classes["info-wrapper"]}>
              {repair?.breakdownDetail && (
                <div
                  className={classes["icon-text"]}
                  title={`Breakdown Detail: ${repair?.breakdownDetail?.id}`}
                >
                  <ToolOutlined />
                  <div className={classes["text"]}>
                    {repair?.breakdownDetail?.id}
                  </div>
                </div>
              )}
              <div className={classes["icon-text"]}>
                <FaRegUser />
                <div className={classes["text"]}>
                  {repair.createdBy.fullName} ({repair.createdBy.rcno})
                </div>
              </div>
            </div>
          </div>
          {hover && <AddRepairComment repair={repair} isDeleted={isDeleted} />}
        </div>
        {hasPermission && (
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
        )}
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
