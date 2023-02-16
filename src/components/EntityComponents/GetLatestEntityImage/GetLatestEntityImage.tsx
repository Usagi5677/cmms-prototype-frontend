import axios from "axios";
import { useEffect, useState } from "react";
import { Image, Spin } from "antd";
import classes from "./GetLatestEntityImage.module.css";
import EntityAttachment from "../../../models/Entity/EntityAttachment";

const GetLatestEntityImage = ({
  attachmentData,
}: {
  attachmentData: EntityAttachment;
}) => {
  const [file, setFile] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [fileLoading, setFileLoading] = useState(true);
  const [isImage, setIsImage] = useState(false);

  const attachmentId = attachmentData?.id;
  const url = `${
    process.env.REACT_APP_API_URL?.split("graphql")[0]
  }attachment/entity/${attachmentId}`;
  const token = localStorage.getItem("cmms_token");
  useEffect(() => {
    if (attachmentId) {
      setFileLoading(true);
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
    } else {
      setFileLoading(false);
    }
  }, [attachmentId]);
  return (
    <div>
      {file && isImage ? (
        <div className={classes["image"]}>
          <Image src={file} style={{aspectRatio: "16/9", objectFit: "contain"}}/>
        </div>
      ) : fileLoading ? (
        <div className={classes["image"]}>
          <Spin />
        </div>
      ) : (
        <div className={classes["image"]}>No image</div>
      )}
    </div>
  );
};

export default GetLatestEntityImage;
