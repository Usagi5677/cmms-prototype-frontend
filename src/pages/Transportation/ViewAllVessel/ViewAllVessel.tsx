import { Empty, message, Select, Spin } from "antd";
import Search from "../../../components/common/Search";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { errorMessage } from "../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { ALL_ENTITY, GET_ALL_ENTITY_STATUS_COUNT } from "../../../api/queries";
import { DEPARTMENTS, ISLANDS } from "../../../helpers/constants";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAllVessel.module.css";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import UserContext from "../../../contexts/UserContext";
import StatusCard from "../../../components/common/StatusCard/StatusCard";
import { FaCarCrash, FaRecycle, FaSpinner } from "react-icons/fa";
import { RiSailboatFill } from "react-icons/ri";
import AddEntity from "../../../components/EntityComponents/AddEntity/AddEntity";
import EntityStatusFilter from "../../../components/common/EntityStatusFilter";
import EntityCard from "../../../components/EntityComponents/EntityCard/EntityCard";
import { Entity } from "../../../models/Entity/Entity";
import { hasPermissions } from "../../../helpers/permissions";
import { TypeSelector } from "../../../components/Type/TypeSelector";
import { motion } from "framer-motion";

const Vessels = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [params, setParams] = useSearchParams();
  const [location, setLocation] = useState([]);
  const [department, setDepartment] = useState([]);
  const [typeId, setTypeId] = useState<number | null>(null);
  const navigate = useNavigate();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      entityType: string;
      status: any;
      location: string[];
      department: string[];
      typeId: number | null;
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: "",
    location: [],
    department: [],
    entityType: "Vessel",
    status: params.get("status"),
    typeId: null,
  });

  const [getAllEntity, { data, loading }] = useLazyQuery(ALL_ENTITY, {
    onError: (err) => {
      errorMessage(err, "Error loading vessels.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Update url search param on filter change
  useEffect(() => {
    let newParams: any = {};
    if (filter.status) newParams.status = filter.status;
    setParams(newParams);
  }, [filter, setParams, params]);

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    if (
      self?.machineAssignments.length === 0 &&
      !hasPermissions(self, ["VIEW_ALL_ENTITY"])
    ) {
      navigate("/");
      message.error("No permission to view all vessels.");
    }
    getAllEntity({ variables: filter });
  }, [filter, getAllEntity]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationValue: string[],
    departmentValue: string[],
    typeIdValue: number
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          location: locationValue,
          department: departmentValue,
          typeId: typeIdValue,
          first: 20,
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
    searchDebounced(search, location, department, typeId!);
    // eslint-disable-next-line
  }, [search, location, department, typeId]);

  const [getAllEntityStatusCount, { data: statusData }] = useLazyQuery(
    GET_ALL_ENTITY_STATUS_COUNT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading status count of entities.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    getAllEntityStatusCount({
      variables: {
        entityType: "Vessel",
      },
    });
  }, [getAllEntityStatusCount]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 20,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 20,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllEntity.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let options: any = [];
  ISLANDS?.sort((a, b) => a.localeCompare(b))?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  let departmentOptions: any = [];
  DEPARTMENTS?.sort((a, b) => a.localeCompare(b))?.map((dp: string) => {
    departmentOptions.push({
      value: dp,
      label: dp,
    });
  });

  let idle = 0;
  let working = 0;
  let breakdown = 0;
  let dispose = 0;
  let total = 0;

  const statusCountData = statusData?.allEntityStatusCount;
  if (statusCountData) {
    idle = statusCountData?.idle;
    working = statusCountData?.working;
    breakdown = statusCountData?.breakdown;
    dispose = statusCountData?.dispose;
    total = idle + working + breakdown + dispose;
  }

  return (
    <>
      <div className={classes["status-card"]}>
        <div className={classes["total-card"]}>
          <div className={classes["total-title"]}>Transports</div>
          <div className={classes["total-amount"]}>{total}</div>
        </div>
        <StatusCard
          amountOne={working}
          icon={<RiSailboatFill />}
          iconBackgroundColor={"rgb(224,255,255)"}
          iconColor={"rgb(0,139,139)"}
          name={"Working"}
        />
        <StatusCard
          amountOne={idle}
          icon={<FaSpinner />}
          iconBackgroundColor={"rgba(255,165,0,0.2)"}
          iconColor={"rgb(219,142,0)"}
          name={"Idle"}
        />
        <StatusCard
          amountOne={breakdown}
          icon={<FaCarCrash />}
          iconBackgroundColor={"rgba(255,0,0,0.2)"}
          iconColor={"rgb(139,0,0)"}
          name={"Breakdown"}
        />
        <StatusCard
          amountOne={dispose}
          icon={<FaRecycle />}
          iconBackgroundColor={"rgba(102, 0, 0,0.3)"}
          iconColor={"rgb(102, 0, 0)"}
          name={"Dispose"}
        />
      </div>
      <div className={classes["container"]}>
        <div className={classes["options-wrapper"]}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.3,
              delay: 0.4,
            }}
          >
            <Search
              searchValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => setSearch("")}
            />
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.3,
              delay: 0.5,
            }}
          >
            <Select
              showArrow
              className={classes["location"]}
              onChange={(value) => setLocation(value)}
              showSearch
              options={options}
              placeholder={"Location"}
              mode="multiple"
            />
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.3,
              delay: 0.6,
            }}
          >
            <EntityStatusFilter
              onChange={(status) => {
                setFilter({ ...filter, status, ...DefaultPaginationArgs });
                setPage(1);
              }}
              value={filter.status}
            />
          </motion.div>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.3,
              delay: 0.7,
            }}
          >
            <TypeSelector
              entityType={"Vessel"}
              setTypeId={setTypeId}
              rounded={true}
            />
          </motion.div>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.3,
              delay: 0.8,
            }}
          >
            <div className={classes["item-wrapper"]}>
              {hasPermissions(self, ["ADD_ENTITY"]) ? (
                <AddEntity entityType="Vessel" />
              ) : null}
            </div>
          </motion.div>
        </div>
        {loading && (
          <div>
            <Spin style={{ width: "100%", margin: "2rem auto" }} />
          </div>
        )}
        {data?.getAllEntity.edges.length > 0 ? (
          <div>
            {data?.getAllEntity.edges.map((rec: { node: Entity }) => {
              const entity = rec.node;
              return <EntityCard entity={entity} key={entity.id} />;
            })}
          </div>
        ) : (
          <div
            style={{
              marginTop: 50,
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}

        <PaginationButtons
          pageInfo={pageInfo}
          page={page}
          next={next}
          back={back}
          pageLimit={20}
        />
      </div>
    </>
  );
};

export default Vessels;
