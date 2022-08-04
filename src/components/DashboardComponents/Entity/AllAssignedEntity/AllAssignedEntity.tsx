import { Avatar, Collapse, Empty, Select, Spin, Tooltip } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DefaultPaginationArgs from "../../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../../models/PaginationArgs";
import { errorMessage } from "../../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  GET_ALL_MACHINE_AND_TRANSPORTATION_STATUS_COUNT,
  GET_ALL_ASSIGNED_ENTITY,
} from "../../../../api/queries";
import { ISLANDS } from "../../../../helpers/constants";
import classes from "./AllAssignedEntity.module.css";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import UserContext from "../../../../contexts/UserContext";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaTractor,
} from "react-icons/fa";
import { EntityStatus } from "../../../../models/Enums";
import { stringToColor } from "../../../../helpers/style";
import Search from "../../../common/Search";
import EntityStatusFilter from "../../../common/EntityStatusFilter";
import EntityModel from "../../../../models/Entity/EntityModel";
import EntityStatusTag from "../../../common/EntityStatusTag";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";

const AllAssignedEntity = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<any>();
  const [timerId, setTimerId] = useState(null);
  const [location, setLocation] = useState([]);

  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      status: any;
      location: string[];
      isAssigned: boolean;
    }
  >({
    first: 3,
    last: null,
    before: null,
    after: null,
    search: "",
    status: null,
    location: [],
    isAssigned: true,
  });

  const [getAllMachineAndTransportStatusCount, { data: statusData }] =
    useLazyQuery(GET_ALL_MACHINE_AND_TRANSPORTATION_STATUS_COUNT, {
      onError: (err) => {
        errorMessage(err, "Error loading status count of entities");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  const [getAllAssignedEntity, { data, loading }] = useLazyQuery(
    GET_ALL_ASSIGNED_ENTITY,
    {
      onError: (err) => {
        errorMessage(err, "Error loading all assigned entities.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch pm when component mounts or when the filter object changes
  useEffect(() => {
    getAllAssignedEntity({ variables: filter });
    getAllMachineAndTransportStatusCount({
      variables: {
        isAssigned: true,
      },
    });
  }, [filter, getAllAssignedEntity, getAllMachineAndTransportStatusCount]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    statusValue: EntityStatus,
    locationValue: string[]
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          status: statusValue,
          location: locationValue,
          first: 3,
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
    // eslint-disable-next-line no-restricted-globals
    searchDebounced(search, status, location);
    // eslint-disable-next-line
  }, [search, status, location]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 3,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 3,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllAssignedEntity.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let working =
    statusData?.allMachineAndTransportStatusCount?.transportationWorking;
  let breakdown =
    statusData?.allMachineAndTransportStatusCount?.transportationBreakdown;
  let idle = statusData?.allMachineAndTransportStatusCount?.transportationIdle;

  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  return (
    <div className={classes["pm-container"]}>
      <div className={classes["heading"]}>Assigned Entities</div>
      <div className={classes["options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <div className={classes["status-wrapper"]}>
          <EntityStatusFilter
            onChange={(status) => {
              setFilter({ ...filter, status, ...DefaultPaginationArgs });
              setPage(1);
              setStatus(status);
            }}
            value={filter.status}
          />
          <Select
            showArrow
            className={classes["location"]}
            onChange={(value) => setLocation(value)}
            showSearch
            options={options}
            placeholder={"Location"}
            mode="multiple"
          />
        </div>
      </div>
      <div className={classes["counter-container"]}>
        <div className={classes["counter-wrapper"]}>
          <div className={classes["counter-value"]}>{breakdown}</div>
          <div className={classes["breakdown"]}>Breakdown</div>
        </div>
        <div className={classes["counter-wrapper"]}>
          <div className={classes["counter-value"]}>{idle}</div>
          <div className={classes["idle"]}>Idle</div>
        </div>
        <div className={classes["counter-wrapper"]}>
          <div className={classes["counter-value"]}>{working}</div>
          <div className={classes["working"]}>Working</div>
        </div>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {data?.getAllAssignedEntity.edges.length > 0 ? (
        data?.getAllAssignedEntity.edges.map((rec: { node: EntityModel }) => {
          const entity = rec.node;
          return (
            <div id="collapse" key={entity.id}>
              <Collapse ghost style={{ marginBottom: ".5rem" }}>
                <Collapse.Panel
                  header={
                    <>
                      <div
                        className={classes["header-container"]}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className={classes["first-block"]}>
                          <div>
                            <div className={classes["title-wrapper"]}>
                              <FaTractor />
                              <span className={classes["title"]}>
                                {entity?.machineNumber}
                              </span>
                            </div>
                            <div className={classes["location-wrapper"]}>
                              <FaMapMarkerAlt style={{ marginRight: 5 }} />
                              <div>
                                <div className={classes["location-width"]}>
                                  {entity?.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={classes["service-reading-wrapper"]}>
                          <div className={classes["reading"]}>
                            <div>
                              <span className={classes["reading-title"]}>
                                Assigned to:
                              </span>
                              <span className={classes["center"]}>
                                {entity?.assignees?.length! > 0 ? (
                                  <Avatar.Group
                                    maxCount={5}
                                    maxStyle={{
                                      color: "#f56a00",
                                      backgroundColor: "#fde3cf",
                                    }}
                                  >
                                    {entity?.assignees?.map((assign) => {
                                      return (
                                        <Tooltip
                                          title={
                                            <>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {assign?.user?.fullName} (
                                                {assign?.user?.rcno})
                                              </div>
                                            </>
                                          }
                                          placement="bottom"
                                          key={assign?.user?.id}
                                        >
                                          <Avatar
                                            style={{
                                              backgroundColor: stringToColor(
                                                assign?.user?.fullName!
                                              ),
                                            }}
                                            size={22}
                                          >
                                            {assign?.user?.fullName
                                              .match(/^\w|\b\w(?=\S+$)/g)
                                              ?.join()
                                              .replace(",", "")
                                              .toUpperCase()}
                                          </Avatar>
                                        </Tooltip>
                                      );
                                    })}
                                  </Avatar.Group>
                                ) : (
                                  <span>None</span>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className={classes["status"]}>
                            <EntityStatusTag status={entity?.status} />
                          </div>
                        </div>
                        <Link to={"/entity/" + entity?.id}>
                          <Tooltip title="Open">
                            <FaArrowAltCircleRight
                              className={classes["button"]}
                            />
                          </Tooltip>
                        </Link>
                      </div>
                    </>
                  }
                  key={entity?.id!}
                >
                  <div className={classes["container"]}></div>
                </Collapse.Panel>
              </Collapse>
            </div>
          );
        })
      ) : (
        <Empty />
      )}

      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
        pageLimit={3}
      />
    </div>
  );
};

export default AllAssignedEntity;
