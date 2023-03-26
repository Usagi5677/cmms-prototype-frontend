import { Avatar, Image, Spin, Tooltip } from "antd";
import { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  DownloadOutlined,
  WarningOutlined,
  StarFilled,
} from "@ant-design/icons";
import classes from "./ParsedEntityAttachment.module.css";
import UserContext from "../../../contexts/UserContext";
import EntityAttachment from "../../../models/Entity/EntityAttachment";
import EditEntityAttachment from "../EditEntityAttachment/EditEntityAttachment";
import DeleteEntityAttachment from "../DeleteEntityAttachment/DeleteEntityAttachment";
import { hasPermissions, isAssignedType } from "../../../helpers/permissions";
import { Entity } from "../../../models/Entity/Entity";
import SetFavouriteAttachment from "../SetFavouriteAttachment/SetFavouriteAttachment";
import { CenteredSpin } from "../../common/CenteredSpin";
import { stringToColor } from "../../../helpers/style";

const ParsedEntityAttachment = ({
  attachmentData,
  isDeleted,
  checklistView = false,
  entity,
}: {
  attachmentData: EntityAttachment;
  isDeleted?: boolean | undefined;
  checklistView?: boolean;
  entity?: Entity;
}) => {
  const { user: self } = useContext(UserContext);
  const attachmentId = attachmentData.id;
  const url = `${
    process.env.REACT_APP_API_URL?.split("graphql")[0]
  }attachment/entity/${attachmentId}`;
  const token = localStorage.getItem("cmms_token");

  const [file, setFile] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [fileLoading, setFileLoading] = useState(true);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    axios({
      method: "get",
      url,
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: token ? `Bearer ${token}` : "",
      },
      responseType: "blob",
    })
      .then(function (response) {
        if (response.headers["content-type"].split("/")[0] === "image") {
          setIsImage(true);
        }
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const dataURL = URL.createObjectURL(blob);
        setFile(dataURL);
        setIsError(false);
      })
      .catch(function () {
        setIsError(true);
      })
      .finally(function () {
        setFileLoading(false);
      });
  }, []);
  // Create a hidden <a> element within the document to act as a download anchor
  const download = () => {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = file;
    a.download = attachmentData.originalName;
    a.click();
  };

  // Shorten file names longer than 25 characters
  const shortFileName = (name: string): string => {
    if (name.length < 25) return name;
    const split = name.split(".");
    const ext = split[split.length - 1];
    const rest = split.slice(0, -1).join(".");
    return `${rest.substring(0, 20)}...${ext}`;
  };

  let assigned = false;
  if (isAssignedType("any", entity!, self)) {
    assigned = true;
  }
  return (
    <div
      className={classes["container"]}
      style={{
        width: checklistView ? 120 : 230,
        minHeight: checklistView ? 165 : 165,
      }}
    >
      {file && isImage && (
        <Image
          src={file}
          className={classes["image"]}
          style={{ minHeight: checklistView ? 100 : "undefined" }}
        />
      )}
      {isError && (
        <div style={{ color: "orange" }}>
          <WarningOutlined style={{ marginRight: 5 }} />
          Error loading attachment.
        </div>
      )}

      <div
        className={classes["info-wrapper"]}
        style={{ minHeight: checklistView ? 60 : 60 }}
      >
        {!checklistView && (
          <div className={classes["option-wrapper"]}>
            <div className={classes["options"]}>
              {fileLoading && <CenteredSpin />}
              {!checklistView && (
                <div className={classes["action-wrapper"]}>
                  {((file && hasPermissions(self, ["VIEW_ALL_ENTITY"])) ||
                    assigned) && (
                    <SetFavouriteAttachment attachment={attachmentData} />
                  )}
                  {((file && hasPermissions(self, ["VIEW_ALL_ENTITY"])) ||
                    assigned) && (
                    <Tooltip title={"Download"}>
                      <DownloadOutlined
                        className={classes["icon"]}
                        onClick={download}
                      />
                    </Tooltip>
                  )}
                  {((file && hasPermissions(self, ["VIEW_ALL_ENTITY"])) ||
                    assigned) && (
                    <EditEntityAttachment attachment={attachmentData} />
                  )}
                  {((file && hasPermissions(self, ["VIEW_ALL_ENTITY"])) ||
                    assigned) && (
                    <DeleteEntityAttachment id={attachmentData?.id} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        <div className={classes["title"]}>
          {attachmentData.favourite ? (
            <StarFilled
              style={{ marginRight: 6, color: "var(--ant-warning-color)" }}
            />
          ) : (
            ""
          )}
          <Tooltip
            title={
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {attachmentData?.user?.fullName} ({attachmentData?.user?.rcno}
                  )
                </div>
              </>
            }
            placement="bottom"
            key={attachmentData?.user?.id}
          >
            <Avatar
              style={{
                backgroundColor: stringToColor(attachmentData?.user?.fullName!),
                marginRight: 6
              }}
              size={"small"}
            >
              {attachmentData?.user?.fullName
                .match(/^\w|\b\w(?=\S+$)/g)
                ?.join()
                .replace(",", "")
                .toUpperCase()}
            </Avatar>
          </Tooltip>
          {attachmentData?.description}
        </div>
      </div>
    </div>
  );
};

export default memo(ParsedEntityAttachment);
