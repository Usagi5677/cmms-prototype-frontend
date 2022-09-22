import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { FaRegUser } from "react-icons/fa";
import { REMOVE_SPARE_PR_DETAIL } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import SparePRDetail from "../../../models/SparePRDetails";

import classes from "./SparePRDetailCard.module.css";
const SparePRDetailCard = ({
  sparePRDetail,
  isDeleted,
  hasPermission,
}: {
  sparePRDetail: SparePRDetail;
  isDeleted?: boolean;
  hasPermission?: boolean;
}) => {
  const [removeSparePRDetail, { loading }] = useMutation(
    REMOVE_SPARE_PR_DETAIL,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while removing spare pr detail.");
      },
      refetchQueries: ["sparePRs", "getAllHistoryOfEntity"],
    }
  );
  return (
    <div className={classes["container"]}>
      <div className={classes["detail"]} key={sparePRDetail.id}>
        <div className={classes["description"]}>
          <div className={classes["description-wrapper"]}>
            <div style={{ fontSize: 14 }}>{sparePRDetail.description}</div>
            <div className={classes["info-wrapper"]}>
              <div className={classes["icon-text"]}>
                <FaRegUser />
                <div className={classes["text"]}>
                  {sparePRDetail.createdBy.fullName} (
                  {sparePRDetail.createdBy.rcno})
                </div>
              </div>
            </div>
          </div>
        </div>
        {hasPermission && !isDeleted && (
          <CloseCircleOutlined
            style={{ color: "red" }}
            onClick={() => {
              removeSparePRDetail({
                variables: {
                  id: sparePRDetail.id,
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SparePRDetailCard;
