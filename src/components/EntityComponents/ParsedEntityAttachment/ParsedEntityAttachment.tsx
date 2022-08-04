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

const ParsedEntityAttachment = ({
  attachmentData,
  isDeleted,
}: {
  attachmentData: EntityAttachment;
  isDeleted?: boolean | undefined;
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

  return (
    <div className={classes["container"]}>
      <div className={classes["option-wrapper"]}>
        <div>{attachmentData?.id}</div>
        <div className={classes["options"]}>
          {fileLoading &&  (
            <Spin size="small" style={{ marginRight: 5, marginLeft: 5 }} />
          )}
          {file && self.assignedPermission.hasEntityAttachmentEdit && !isDeleted && (
            <EditEntityAttachment attachment={attachmentData} />
          )}
          {file &&
            self.assignedPermission.hasEntityAttachmentDelete && !isDeleted && (
              <DeleteEntityAttachment id={attachmentData?.id} />
            )}
          {file && (
            <Tooltip title={"Download"}>
              <DownloadOutlined
                className={classes["download-icon"]}
                onClick={download}
              />
            </Tooltip>
          )}
        </div>
      </div>

      {file && isImage && (
        <div className={classes["image-container"]}>
          <Image height={"80%"} width={"80%"} src={file} />
        </div>
      )}
      {isError && (
        <div style={{ color: "orange" }}>
          <WarningOutlined style={{ marginRight: 5 }} />
          Error loading attachment.
        </div>
      )}
      <div className={classes["file-info-wrapper"]}>
        <div>
          <FileOutlined />{" "}
          {attachmentData && (
            <span>{shortFileName(attachmentData?.originalName)}</span>
          )}
        </div>
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
        <div>{attachmentData?.description}</div>
      </div>
    </div>
  );
};

export default ParsedEntityAttachment;
