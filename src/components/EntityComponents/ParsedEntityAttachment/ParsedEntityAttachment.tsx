import { Image, Spin, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FileOutlined,
  DownloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import classes from "./ParsedEntityAttachment.module.css";
import UserContext from "../../../contexts/UserContext";
import { FaRegClock } from "react-icons/fa";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import EntityAttachment from "../../../models/Entity/EntityAttachment";
import EditEntityAttachment from "../EditEntityAttachment/EditEntityAttachment";
import DeleteEntityAttachment from "../DeleteEntityAttachment/DeleteEntityAttachment";
import { hasPermissions, isAssignedType } from "../../../helpers/permissions";
import { Entity } from "../../../models/Entity/Entity";

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
    <div className={classes["container"]}>
      <div className={classes["option-wrapper"]}>
        <div className={classes["options"]}>
          {fileLoading && (
            <Spin size="small" style={{ marginRight: 5, marginLeft: 5 }} />
          )}
          {!checklistView && (
            <>
              {((file && hasPermissions(self, ["VIEW_ALL_ENTITY"])) ||
                assigned) && (
                <EditEntityAttachment attachment={attachmentData} />
              )}
              {((file && hasPermissions(self, ["VIEW_ALL_ENTITY"])) ||
                assigned) && <DeleteEntityAttachment id={attachmentData?.id} />}
              {((file && hasPermissions(self, ["VIEW_ALL_ENTITY"])) ||
                assigned) && (
                <Tooltip title={"Download"}>
                  <DownloadOutlined
                    className={classes["download-icon"]}
                    onClick={download}
                  />
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>

      {file && isImage && (
        <div
          className={classes["image-container"]}
          style={{
            padding: checklistView ? undefined : 10,
            height: checklistView ? 120 : undefined,
            width: checklistView ? 120 : undefined,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image src={file} />
        </div>
      )}
      {isError && (
        <div style={{ color: "orange" }}>
          <WarningOutlined style={{ marginRight: 5 }} />
          Error loading attachment.
        </div>
      )}
      <div className={classes["file-info-wrapper"]}>
        {!checklistView && (
          <>
            <div className={classes["title-wrapper"]}>
              <Tooltip title="Created At" className={classes["flex"]}>
                <FaRegClock />
              </Tooltip>

              <span className={classes["title"]}>
                {moment(attachmentData?.createdAt).format(
                  DATETIME_FORMATS.DAY_MONTH_YEAR
                )}
              </span>
            </div>
          </>
        )}
        <div>{attachmentData?.description}</div>
        {checklistView && (
          <div style={{ opacity: 0.5, fontSize: "80%" }}>
            <div>
              {attachmentData.user.fullName} ({attachmentData.user.rcno})
            </div>
            <div
              title={`${moment(attachmentData.createdAt).format(
                DATETIME_FORMATS.FULL
              )}`}
            >
              {moment(attachmentData.createdAt).format(
                DATETIME_FORMATS.DAY_MONTH_YEAR
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParsedEntityAttachment;
