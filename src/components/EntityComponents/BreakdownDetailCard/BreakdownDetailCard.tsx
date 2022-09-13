import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import {
  REMOVE_BREAKDOWN_COMMENT,
  REMOVE_BREAKDOWN_DETAIL,
} from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import BreakdownDetail from "../../../models/BreakdownDetails";
import Comment from "../../../models/Comment";
import Breakdown from "../../../models/Entity/Breakdown";
import { CommentCard } from "../../common/CommentCard/CommentCard";
import { AddBreakdownComment } from "../AddBreakdownComment";
import classes from "./BreakdownDetailCard.module.css";
const BreakdownDetailCard = ({
  index,
  breakdown,
  detail,
  isDeleted,
}: {
  index: number;
  breakdown: Breakdown;
  detail: BreakdownDetail;
  isDeleted?: boolean;
}) => {
  const [hover, setHover] = useState(false);
  const [removeBreakdownDetail, { loading }] = useMutation(
    REMOVE_BREAKDOWN_DETAIL,
    {
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while removing breakdown detail."
        );
      },
      refetchQueries: ["breakdowns", "getAllHistoryOfEntity"],
    }
  );
  return (
    <div className={classes["container"]}>
      <div
        className={classes["breakdown-detail"]}
        key={detail.id}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={classes["breakdown-description"]}>
          <span className={classes["number"]}>{index + 1}.</span>
          <div className={classes["description-wrapper"]}>
            <div style={{ fontSize: 14 }}>{detail.description}</div>
            <div style={{ opacity: 0.5, fontSize: 12 }}>
              {detail.createdBy.fullName} ({detail.createdBy.rcno})
            </div>
          </div>
          {hover && (
            <AddBreakdownComment
              breakdown={breakdown}
              detail={detail}
              isDeleted={isDeleted}
            />
          )}
        </div>
        <CloseCircleOutlined
          style={{ color: "red" }}
          onClick={() => {
            removeBreakdownDetail({
              variables: {
                id: detail.id,
              },
            });
          }}
        />
      </div>
      {detail?.comments?.map((remark: Comment) => (
        <CommentCard
          comment={remark}
          isRemark
          key={remark.id}
          isDeleted={isDeleted}
          mutation={REMOVE_BREAKDOWN_COMMENT}
          refetchQueries={["breakdowns", "getAllHistoryOfEntity"]}
        />
      ))}
    </div>
  );
};

export default BreakdownDetailCard;
