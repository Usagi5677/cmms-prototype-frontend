import { StarFilled, StarOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { message, Tooltip } from "antd";
import { useParams } from "react-router";
import { SET_FAVOURITE_ATTACHMENT } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import EntityAttachment from "../../../models/Entity/EntityAttachment";
import classes from "./SetFavouriteAttachment.module.css";

const SetFavouriteAttachment = ({
  attachment,
}: {
  attachment: EntityAttachment;
}) => {
  const { id }: any = useParams();
  const [editEntityAttachment, { loading: loadingAttachment }] = useMutation(
    SET_FAVOURITE_ATTACHMENT,
    {
      onCompleted: () => {
        message.success("Successfully updated favourite image.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating favourite image.");
      },
      refetchQueries: [
        "entityAttachments",
        "getAllHistoryOfEntity",
        "getLatestFavouriteAttachment",
      ],
    }
  );

  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title="Favourite">
          {attachment?.favourite ? (
            <StarFilled
              onClick={() =>
                editEntityAttachment({
                  variables: {
                    id: attachment.id,
                    flag: !attachment.favourite,
                    entityId: parseInt(id),
                  },
                })
              }
            />
          ) : (
            <StarOutlined
              onClick={() =>
                editEntityAttachment({
                  variables: {
                    id: attachment.id,
                    flag: !attachment.favourite,
                    entityId: parseInt(id),
                  },
                })
              }
            />
          )}
        </Tooltip>
      </div>
    </>
  );
};

export default SetFavouriteAttachment;
