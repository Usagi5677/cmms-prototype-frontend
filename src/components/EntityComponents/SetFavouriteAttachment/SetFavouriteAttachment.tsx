import { StarFilled, StarOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { message, Tooltip } from "antd";
import { SET_FAVOURITE_ATTACHMENT } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import EntityAttachment from "../../../models/Entity/EntityAttachment";
import classes from "./SetFavouriteAttachment.module.css";

const SetFavouriteAttachment = ({
  attachment,
}: {
  attachment: EntityAttachment;
}) => {
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
