import { useLazyQuery } from "@apollo/client";
import { Badge, Collapse, DatePicker, Empty, Spin } from "antd";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { GET_ALL_ATTACHMENT_OF_ENTITY } from "../../../../api/queries";
import AddEntityAttachment from "../../../../components/EntityComponents/AddEntityAttachment/AddEntityAttachment";
import ParsedEntityAttachment from "../../../../components/EntityComponents/ParsedEntityAttachment/ParsedEntityAttachment";
import UserContext from "../../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../../helpers/constants";
import { errorMessage } from "../../../../helpers/gql";
import {
  hasPermissions,
  isAssignedType,
} from "../../../../helpers/permissions";
import { Entity } from "../../../../models/Entity/Entity";
import EntityAttachment from "../../../../models/Entity/EntityAttachment";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewGallery.module.css";

const ViewGallery = ({
  isDeleted,
  entity,
}: {
  isDeleted?: boolean | undefined;
  entity: Entity;
}) => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [reload, setReload] = useState(false);
  const [dates, setDates] = useState<any>([
    moment().subtract(1, "week"),
    moment(),
  ]);
  const { id }: any = useParams();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      entityId: number;
      from: any;
      to: any;
    }
  >({
    first: 500,
    last: null,
    before: null,
    after: null,
    search: "",
    entityId: parseInt(id),
    from: dates[0].toISOString(),
    to: dates[1].toISOString(),
  });
  // This query only loads the attachment's info from the db, not the file
  const [
    getAttachment,
    { data: attachment, loading: loadingAttachment, error },
  ] = useLazyQuery(GET_ALL_ATTACHMENT_OF_ENTITY, {
    onError: (err) => {
      errorMessage(err, "Error loading attachment.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch attachments when component mounts or when the filter object changes
  useEffect(() => {
    setFilter((filter) => ({
      ...filter,
      search: "",
      entityId: parseInt(id),
      from: dates[0].toISOString(),
      to: dates[1].toISOString(),
      first: 500,
      last: null,
      before: null,
      after: null,
    }));

    getAttachment({
      variables: {
        ...filter,
        entityId: parseInt(id),
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
      },
    });
    setReload(false);
  }, [dates, id, reload]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  /*
  const searchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          entityId: parseInt(id),
          from: dates[0].toISOString(),
          to: dates[1].toISOString(),
          first: 500,
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
  }, [search, id, dates, filter, getAttachment]);
  */
  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 500,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 500,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = attachment?.entityAttachments.pageInfo ?? {};

  const date = new Date(dates[0]);
  const endDate = new Date(dates[1]);
  const dateArray: any = [];

  if (attachment?.entityAttachments.edges) {
    while (date <= endDate) {
      for (const rec of attachment?.entityAttachments.edges) {
        if (
          moment(rec?.node?.createdAt).format(
            DATETIME_FORMATS.DAY_MONTH_YEAR
          ) === moment(date).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
        ) {
          dateArray.push(new Date(date));
          break;
        }
      }
      date.setDate(date.getDate() + 1);
    }
  }

  const dateCount = (date: Date) =>
    attachment?.entityAttachments.edges?.filter(
      (rec: { node: EntityAttachment }) =>
        moment(rec.node.createdAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR) ===
        moment(date).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
    ).length;
  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
      {loadingAttachment && (
          <Spin style={{marginRight: 10}}  />
        )}
        <DatePicker.RangePicker
          className={classes["datepicker"]}
          defaultValue={dates}
          format={DATETIME_FORMATS.DAY_MONTH_YEAR}
          style={{ width: 350, borderRadius: 6 }}
          popupStyle={{ borderRadius: 6 }}
          disabledDate={(date) => date.isAfter(moment(), "day")}
          onChange={setDates}
          allowClear={false}
          ranges={{
            "Past 7 Days": [moment().subtract(1, "week"), moment()],
            "This Week": [moment().startOf("week"), moment()],
            "Past 30 Days": [moment().subtract(30, "day"), moment()],
            "This Month": [moment().startOf("month"), moment()],
          }}
        />
        {hasPermissions(self, ["VIEW_ALL_ENTITY"]) ||
        isAssignedType("any", entity, self) ? (
          <AddEntityAttachment setReload={setReload} />
        ) : null}

        
      </div>
      {attachment?.entityAttachments.edges.length > 0 ? (
        <div>
          {dateArray?.reverse()?.map((dateVal: any, index: number) => {
        return (
          <div className={classes["collapse-container"]} key={index + "div"}>
            <Collapse
              ghost
              style={{ marginBottom: ".5rem" }}
              defaultActiveKey={index + "col"}
            >
              <Collapse.Panel
                header={
                  <div>
                    {moment(dateVal).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
                    {dateCount(dateVal) > 0 && (
                      <Badge
                        count={`${dateCount(dateVal)} image${
                          dateCount(dateVal) === 1 ? "" : "s"
                        }`}
                        style={{
                          color: "black",
                          backgroundColor: "#e5e5e5",
                          marginLeft: ".5rem",
                          marginBottom: ".3rem",
                        }}
                      />
                    )}
                  </div>
                }
                key={index + "col"}
              >
                <div className={classes["grid-container"]}>
                  {attachment?.entityAttachments.edges.map(
                    (rec: { node: EntityAttachment }, i: number) => {
                      const attc = rec.node;
                      if (
                        moment(attc.createdAt).format(
                          DATETIME_FORMATS.DAY_MONTH_YEAR
                        ) ===
                        moment(dateVal).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
                      ) {
                        return (
                          <ParsedEntityAttachment
                            key={attc.id}
                            attachmentData={attc}
                            isDeleted={isDeleted}
                            entity={entity}
                          />
                        );
                      }
                    }
                  )}
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        );
      })}
        </div>
      ) : (
        <Empty/>
      )}

      
    </div>
  );
};

export default ViewGallery;
