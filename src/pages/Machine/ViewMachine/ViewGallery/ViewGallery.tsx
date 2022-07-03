import { UploadOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button, message, Spin, Tooltip, Upload } from "antd";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { GET_ALL_ATTACHMENT_OF_MACHINE } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import AddMachineAttachment from "../../../../components/MachineComponents/AddMachineAttachment/AddMachineAttachment";
import ParsedMachineAttachment from "../../../../components/MachineComponents/MachineAttachment/ParsedMachineAttachment";
import UserContext from "../../../../contexts/UserContext";
import { errorMessage } from "../../../../helpers/gql";
import MachineAttachment from "../../../../models/Machine/MachineAttachment";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewGallery.module.css";

const ViewGallery = ({
  machineID,
  isDeleted,
}: {
  machineID: number;
  isDeleted: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      machineId: number;
    }
  >({
    first: 6,
    last: null,
    before: null,
    after: null,
    search: "",
    machineId: machineID,
  });
  // This query only loads the attachment's info from the db, not the file
  const [
    getAttachment,
    { data: attachment, loading: loadingAttachment, error },
  ] = useLazyQuery(GET_ALL_ATTACHMENT_OF_MACHINE, {
    onError: (err) => {
      errorMessage(err, "Error loading attachment.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch attachments when component mounts or when the filter object changes
  useEffect(() => {
    getAttachment({ variables: filter });
  }, [filter, getAttachment]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          first: 6,
          last: null,
          before: null,
          after: null,
        }));
        setPage(1);
      }, 500)
    );
  };
  const initialRender = useRef<boolean>(true);
  useEffect(() => {
    if (initialRender.current === true) {
      initialRender.current = false;
      return;
    }
    searchDebounced(search);
    // eslint-disable-next-line
  }, [search]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 6,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 6,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = attachment?.machineAttachments.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        {self.assignedPermission.hasMachineAttachmentAdd && !isDeleted ? (
          <AddMachineAttachment machineID={machineID} />
        ) : null}

        {loadingAttachment && (
          <div>
            <Spin style={{ width: "100%", margin: "2rem auto" }} />
          </div>
        )}
      </div>
      <div className={classes["grid-container"]}>
        {attachment?.machineAttachments.edges.map(
          (rec: { node: MachineAttachment }) => {
            const attachment = rec.node;
            return (
              <ParsedMachineAttachment
                key={attachment.id}
                attachmentData={attachment}
                isDeleted={isDeleted}
              />
            );
          }
        )}
      </div>

      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
        pageLimit={6}
      />
    </div>
  );
};

export default ViewGallery;
