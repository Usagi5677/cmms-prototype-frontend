import { Empty, message, Select, Spin } from "antd";
import Search from "../../../components/common/Search";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { errorMessage } from "../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  ALL_ENTITY,
  GET_ALL_CHECKLIST_AND_PM_SUMMARY,
  GET_ALL_ENTITY_STATUS_COUNT,
} from "../../../api/queries";
import { ISLANDS } from "../../../helpers/constants";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAllMachine.module.css";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import UserContext from "../../../contexts/UserContext";
import StatusCard from "../../../components/common/StatusCard/StatusCard";
import { FaCarCrash, FaRecycle, FaSpinner, FaTractor } from "react-icons/fa";
import AddEntity from "../../../components/EntityComponents/AddEntity/AddEntity";
import { Entity } from "../../../models/Entity/Entity";
import EntityCard from "../../../components/EntityComponents/EntityCard/EntityCard";
import { hasPermissions } from "../../../helpers/permissions";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import FilterOptions from "../../../components/common/FilterOptions/FIlterOptions";
import {
  DefaultBooleanOptionProps,
  DefaultStringArrayOptionProps,
  EntityStatus,
  EntityStatusOptionProps,
  FilterOptionProps,
  LocationOptionProps,
  SearchOptionProps,
  SearchReadingOptionProps,
  TypeSelectorOptionProps,
} from "../../../models/Enums";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { WarningOutlined } from "@ant-design/icons";

const Machinery = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [locationIds, setLocationIds] = useState<number[]>([]);
  const [typeId, setTypeId] = useState<number[]>([]);
  const [status, setStatus] = useState<EntityStatus[]>([]);
  const [zone, setZone] = useState<string[]>([]);
  const [department, setDepartment] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [engine, setEngine] = useState<string[]>([]);
  const [measurement, setMeasurement] = useState<string[]>([]);
  const [isAssigned, setIsAssigned] = useState<boolean>(false);
  //const [assignedToMe, setAssignedToMe] = useState<number | null>(null);
  const [lteCurrentRunning, setLteCurrentRunning] = useState("");
  const [gteCurrentRunning, setGteCurrentRunning] = useState("");
  const [lteLastService, setLteLastService] = useState("");
  const [gteLastService, setGteLastService] = useState("");
  const navigate = useNavigate();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      status: EntityStatus[];
      locationIds: number[];
      entityType: string;
      typeId: number[];
      zone: string[];
      department: string[];
      brand: string[];
      engine: string[];
      isAssigned: boolean;
      //assignedToId: number | null;
      measurement: string[];
      lteCurrentRunning: string;
      gteCurrentRunning: string;
      lteLastService: string;
      gteLastService: string;
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: "",
    locationIds: [],
    status: [],
    entityType: "Machine",
    typeId: [],
    zone: [],
    department: [],
    brand: [],
    engine: [],
    isAssigned: false,
    //assignedToId: null,
    measurement: [],
    lteCurrentRunning: "",
    gteCurrentRunning: "",
    lteLastService: "",
    gteLastService: "",
  });

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

  const [getAllEntityChecklistAndPMSummary, { data: summaryData }] =
    useLazyQuery(GET_ALL_CHECKLIST_AND_PM_SUMMARY, {
      onError: (err) => {
        errorMessage(err, "Error loading summary data.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  const [getAllEntity, { data, loading }] = useLazyQuery(ALL_ENTITY, {
    onError: (err) => {
      errorMessage(err, "Error loading machines.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch when component mounts or when the filter object changes
  useEffect(() => {
    if (
      self?.machineAssignments.length === 0 &&
      !hasPermissions(self, ["VIEW_ALL_ENTITY"])
    ) {
      navigate("/");
      message.error("No permission to view all entity.");
    }
    getAllEntity({ variables: filter });
  }, [filter, getAllEntity]);

  //Fetch all machine status count
  useEffect(() => {
    getAllEntityStatusCount({
      variables: {
        entityType: "Machine",
      },
    });
    getAllEntityChecklistAndPMSummary();
  }, [getAllEntityStatusCount, getAllEntityChecklistAndPMSummary]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationIds: number[],
    typeIdValue: number[],
    statusValue: EntityStatus[],
    zoneValue: string[],
    departmentValue: string[],
    brandValue: string[],
    engineValue: string[],
    measurementValue: string[],
    isAssignedValue: boolean,
    //assignedToMeValue: number,
    lteCurrentRunningValue: string,
    gteCurrentRunningValue: string,
    lteLastServiceValue: string,
    gteLastServiceValue: string
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          locationIds,
          typeId: typeIdValue,
          status: statusValue,
          zone: zoneValue,
          department: departmentValue,
          brand: brandValue,
          engine: engineValue,
          measurement: measurementValue,
          isAssigned: isAssignedValue,
          //assignedToId: assignedToMeValue,
          lteCurrentRunning: lteCurrentRunningValue,
          gteCurrentRunning: gteCurrentRunningValue,
          lteLastService: lteLastServiceValue,
          gteLastService: gteLastServiceValue,
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
    searchDebounced(
      search,
      locationIds,
      typeId,
      status,
      zone,
      department,
      brand,
      engine,
      measurement,
      isAssigned,
      //assignedToMe!,
      lteCurrentRunning,
      gteCurrentRunning,
      lteLastService,
      gteLastService
    );
    // eslint-disable-next-line
  }, [
    search,
    locationIds,
    typeId,
    status,
    zone,
    department,
    brand,
    engine,
    measurement,
    isAssigned,
    //assignedToMe,
    lteCurrentRunning,
    gteCurrentRunning,
    lteLastService,
    gteLastService,
  ]);

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

  let critical = 0;
  let working = 0;
  let breakdown = 0;
  let dispose = 0;
  let total = 0;

  const statusCountData = statusData?.allEntityStatusCount;
  if (statusCountData) {
    critical = statusCountData?.critical;
    working = statusCountData?.working;
    breakdown = statusCountData?.breakdown;
    dispose = statusCountData?.dispose;
    total = critical + working + breakdown + dispose;
  }

  const clearAll = () => {
    setSearch("");
    setLteCurrentRunning("");
    setGteCurrentRunning("");
    setLteLastService("");
    setGteLastService("");
    setStatus([]);
    setLocationIds([]);
    setZone([]);
    setDepartment([]);
    setBrand([]);
    setEngine([]);
    setMeasurement([]);
    setTypeId([]);
    setIsAssigned(false);
    //setAssignedToMe(null);
  };
  const searchOptions: SearchOptionProps = {
    searchValue: search,
    onChange: (e) => setSearch(e.target.value),
    onClick: () => setSearch(""),
    width: "100%",
  };
  const lteCurrentRunningOptions: SearchReadingOptionProps = {
    searchValue: lteCurrentRunning,
    onChange: (e) => setLteCurrentRunning(e.target.value),
    onClick: () => setLteCurrentRunning(""),
    width: "100%",
  };
  const gteCurrentRunningOptions: SearchReadingOptionProps = {
    searchValue: gteCurrentRunning,
    onChange: (e) => setGteCurrentRunning(e.target.value),
    onClick: () => setGteCurrentRunning(""),
    width: "100%",
  };
  const lteLastServiceOptions: SearchReadingOptionProps = {
    searchValue: lteLastService,
    onChange: (e) => setLteLastService(e.target.value),
    onClick: () => setLteLastService(""),
    width: "100%",
  };
  const gteLastServiceOptions: SearchReadingOptionProps = {
    searchValue: gteLastService,
    onChange: (e) => setGteLastService(e.target.value),
    onClick: () => setGteLastService(""),
    width: "100%",
  };
  const locationOptions: LocationOptionProps = {
    setLocationId: setLocationIds,
    width: "100%",
  };
  const zoneOptions: DefaultStringArrayOptionProps = {
    onChange: (zone: string[]) => {
      setFilter({
        ...filter,
        zone,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setZone(zone);
    },
    width: "100%",
  };
  const departmentOptions: DefaultStringArrayOptionProps = {
    onChange: (department: string[]) => {
      setFilter({
        ...filter,
        department,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setDepartment(department);
    },
    width: "100%",
  };
  const brandOptions: DefaultStringArrayOptionProps = {
    onChange: (brand: string[]) => {
      setFilter({
        ...filter,
        brand,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setBrand(brand);
    },
    width: "100%",
  };
  const engineOptions: DefaultStringArrayOptionProps = {
    onChange: (engine: string[]) => {
      setFilter({
        ...filter,
        engine,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setEngine(engine);
    },
    width: "100%",
  };
  const measurementOptions: DefaultStringArrayOptionProps = {
    onChange: (measurement: string[]) => {
      setFilter({
        ...filter,
        measurement,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setMeasurement(measurement);
    },
    width: "100%",
  };
  const assignedOptions: DefaultBooleanOptionProps = {
    onChange: (isAssigned: CheckboxChangeEvent) => {
      setFilter({
        ...filter,
        isAssigned: isAssigned?.target?.checked,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setIsAssigned(isAssigned?.target?.checked);
    },
    name: "Show all assigned machinery",
  };
  /*
  const assignedToMeOptions: DefaultBooleanOptionProps = {
    onChange: (assignedToMe: CheckboxChangeEvent) => {
      setFilter({
        ...filter,
        assignedToId: assignedToMe?.target?.checked ? self?.id : null,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setAssignedToMe(assignedToMe?.target?.checked ? self?.id : null);
    },
    name: "Show all machinery assigned to me",
  };
  */
  const entityStatusOptions: EntityStatusOptionProps = {
    onChange: (status) => {
      setFilter({
        ...filter,
        status,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setStatus(status);
    },
    value: filter.status,
    width: "100%",
  };
  const typeSelectorOptions: TypeSelectorOptionProps = {
    entityType: "Machine",
    setTypeId,
    rounded: true,
    multiple: true,
    width: "100%",
  };
  const filterOptions: FilterOptionProps = {
    searchOptions,
    locationOptions,
    entityStatusOptions,
    typeSelectorOptions,
    zoneOptions,
    departmentOptions,
    brandOptions,
    engineOptions,
    measurementOptions,
    assignedOptions,
    //assignedToMeOptions,
    lteCurrentRunningOptions,
    gteCurrentRunningOptions,
    lteLastServiceOptions,
    gteLastServiceOptions,
  };

  return (
    <>
      <div className={classes["status-card"]}>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            ease: "easeOut",
            duration: 0.3,
            delay: 0.3,
          }}
        >
          <div className={classes["total-card"]}>
            <motion.div
              className={classes["total-title"]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                ease: "easeOut",
                duration: 0.3,
                delay: 0.7,
              }}
            >
              Machinery
            </motion.div>
            <div className={classes["total-amount"]}>
              <CountUp end={total} duration={1} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            ease: "easeOut",
            duration: 0.3,
            delay: 0.4,
          }}
        >
          <StatusCard
            amountOne={working}
            icon={<FaTractor />}
            iconBackgroundColor={"var(--working-bg)"}
            iconColor={"var(--working-color)"}
            name={"Working"}
          />
        </motion.div>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            ease: "easeOut",
            duration: 0.3,
            delay: 0.5,
          }}
        >
          <StatusCard
            amountOne={critical}
            icon={<WarningOutlined />}
            iconBackgroundColor={"var(--critical-bg)"}
            iconColor={"var(--critical-color)"}
            name={"Critical"}
          />
        </motion.div>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            ease: "easeOut",
            duration: 0.3,
            delay: 0.6,
          }}
        >
          <StatusCard
            amountOne={breakdown}
            icon={<FaCarCrash />}
            iconBackgroundColor={"var(--breakdown-bg)"}
            iconColor={"var(--breakdown-color)"}
            name={"Breakdown"}
          />
        </motion.div>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            ease: "easeOut",
            duration: 0.3,
            delay: 0.7,
          }}
        >
          <StatusCard
            amountOne={dispose}
            icon={<FaRecycle />}
            iconBackgroundColor={"var(--dispose-bg)"}
            iconColor={"var(--dispose-color)"}
            name={"Dispose"}
          />
        </motion.div>
      </div>
      <div className={classes["wrapper"]}>
        <FilterOptions options={filterOptions} onClick={clearAll} />
        <div className={classes["container"]}>
          <div className={classes["options-wrapper"]}>
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
                  <AddEntity entityType="Machine" />
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
                return (
                  <EntityCard
                    entity={entity}
                    key={entity.id}
                    summaryData={summaryData?.getAllEntityChecklistAndPMSummary}
                  />
                );
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
      </div>
    </>
  );
};

export default Machinery;
