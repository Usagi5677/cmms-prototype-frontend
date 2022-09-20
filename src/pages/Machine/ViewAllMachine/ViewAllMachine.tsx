import { Empty, message, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationArgs from "../../../models/PaginationArgs";
import { errorMessage } from "../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  ALL_ENTITY,
  GET_ALL_CHECKLIST_AND_PM_SUMMARY,
  GET_ALL_ENTITY_STATUS_COUNT,
} from "../../../api/queries";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAllMachine.module.css";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import UserContext from "../../../contexts/UserContext";
import StatusCard from "../../../components/common/StatusCard/StatusCard";
import { FaCarCrash, FaRecycle, FaTractor } from "react-icons/fa";
import AddEntity from "../../../components/EntityComponents/AddEntity/AddEntity";
import { Entity } from "../../../models/Entity/Entity";
import EntityCard from "../../../components/EntityComponents/EntityCard/EntityCard";
import { hasPermissions } from "../../../helpers/permissions";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import FilterOptions from "../../../components/common/FilterOptions/FIlterOptions";
import {
  DefaultBooleanOptionProps,
  DefaultNumberArrayOptionProps,
  DefaultStringArrayOptionProps,
  EntityStatus,
  EntityStatusOptionProps,
  FilterOptionProps,
  SearchOptionProps,
  SearchReadingOptionProps,
  TypeSelectorOptionProps,
} from "../../../models/Enums";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { WarningOutlined } from "@ant-design/icons";
import { useLocalStorage } from "../../../helpers/useLocalStorage";

const Machinery = () => {
  const getFilter = localStorage.getItem("filter");
  let getFilterObjects: any = "";
  if (getFilter) {
    getFilterObjects = JSON.parse(JSON.parse(getFilter));
  }
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [timerId, setTimerId] = useState(null);
  const [search, setSearch] = useState(getFilterObjects?.search);
  const [locationIds, setLocationIds] = useState<number[]>(getFilterObjects?.locationIds);
  const [typeIds, setTypeIds] = useState<number[]>(getFilterObjects?.typeIds);
  const [status, setStatus] = useState<EntityStatus[]>(getFilterObjects?.status);
  const [zoneIds, setZoneIds] = useState<number[]>(getFilterObjects?.zoneIds);
  const [department, setDepartment] = useState<string[]>(getFilterObjects?.department);
  const [brand, setBrand] = useState<string[]>(getFilterObjects?.brand);
  const [engine, setEngine] = useState<string[]>(getFilterObjects?.engine);
  const [measurement, setMeasurement] = useState<string[]>(getFilterObjects?.measurement);
  const [isAssigned, setIsAssigned] = useState<boolean>(getFilterObjects?.isAssigned);
  //const [assignedToMe, setAssignedToMe] = useState<number | null>(null);
  const [lteCurrentRunning, setLteCurrentRunning] = useState(getFilterObjects?.lteCurrentRunning);
  const [gteCurrentRunning, setGteCurrentRunning] = useState(getFilterObjects?.gteCurrentRunning);
  const [lteLastService, setLteLastService] = useState(getFilterObjects?.lteLastService);
  const [gteLastService, setGteLastService] = useState(getFilterObjects?.gteLastService);
  const [isIncompleteChecklistTask, setIsIncompleteChecklistTask] =
    useState<boolean>(getFilterObjects?.isIncompleteChecklistTask);
  const navigate = useNavigate();

  const [saveFilterOptions, setSaveFilterOptions] = useLocalStorage(
    "filter",
    JSON.stringify({
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      status: [],
      entityType: "Machine",
      typeIds: [],
      zoneIds: [],
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
      isIncompleteChecklistTask: false,
    })
  );
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      status: EntityStatus[];
      locationIds: number[];
      entityType: string;
      typeIds: number[];
      zoneIds: number[];
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
      isIncompleteChecklistTask: boolean;
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: JSON.parse(saveFilterOptions)?.search,
    locationIds: JSON.parse(saveFilterOptions)?.locationIds,
    status: JSON.parse(saveFilterOptions)?.status,
    entityType: "Machine",
    typeIds: JSON.parse(saveFilterOptions)?.typeIds,
    zoneIds: JSON.parse(saveFilterOptions)?.zoneIds,
    department: JSON.parse(saveFilterOptions)?.department,
    brand: JSON.parse(saveFilterOptions)?.brand,
    engine: JSON.parse(saveFilterOptions)?.engine,
    isAssigned: JSON.parse(saveFilterOptions)?.isAssigned,
    //assignedToId: null,
    measurement: JSON.parse(saveFilterOptions)?.measurement,
    lteCurrentRunning: JSON.parse(saveFilterOptions)?.lteCurrentRunning,
    gteCurrentRunning: JSON.parse(saveFilterOptions)?.gteCurrentRunning,
    lteLastService: JSON.parse(saveFilterOptions)?.lteLastService,
    gteLastService: JSON.parse(saveFilterOptions)?.gteLastService,
    isIncompleteChecklistTask:
      JSON.parse(saveFilterOptions)?.isIncompleteChecklistTask,
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
    setSaveFilterOptions(JSON.stringify(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, getAllEntity]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationIdsValue: number[],
    typeIdsValue: number[],
    statusValue: EntityStatus[],
    zoneIdsValue: number[],
    departmentValue: string[],
    brandValue: string[],
    engineValue: string[],
    measurementValue: string[],
    isAssignedValue: boolean,
    //assignedToMeValue: number,
    lteCurrentRunningValue: string,
    gteCurrentRunningValue: string,
    lteLastServiceValue: string,
    gteLastServiceValue: string,
    isIncompleteChecklistTaskValue: boolean
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          locationIds: locationIdsValue,
          typeIds: typeIdsValue,
          status: statusValue,
          zoneIds: zoneIdsValue,
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
          isIncompleteChecklistTask: isIncompleteChecklistTaskValue,
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
      typeIds,
      status,
      zoneIds,
      department,
      brand,
      engine,
      measurement,
      isAssigned,
      //assignedToMe!,
      lteCurrentRunning,
      gteCurrentRunning,
      lteLastService,
      gteLastService,
      isIncompleteChecklistTask
    );
    // eslint-disable-next-line
  }, [
    search,
    locationIds,
    typeIds,
    status,
    zoneIds,
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
    isIncompleteChecklistTask,
  ]);


  //Fetch all machine status count
  useEffect(() => {
    getAllEntityStatusCount({ variables: filter });
    getAllEntityChecklistAndPMSummary();
  }, [filter, getAllEntityStatusCount, getAllEntityChecklistAndPMSummary]);

  

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
    const clearFilter = {
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      status: [],
      entityType: "Machine",
      typeIds: [],
      zoneIds: [],
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
      isIncompleteChecklistTask: false,
    };
    setSaveFilterOptions(JSON.stringify(clearFilter));

    setSearch("");
    setLteCurrentRunning("");
    setGteCurrentRunning("");
    setLteLastService("");
    setGteLastService("");
    setStatus([]);
    setLocationIds([]);
    setZoneIds([]);
    setDepartment([]);
    setBrand([]);
    setEngine([]);
    setMeasurement([]);
    setTypeIds([]);
    setIsAssigned(false);
    setIsIncompleteChecklistTask(false);
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
  const locationOptions: DefaultNumberArrayOptionProps = {
    setId: setLocationIds,
    currentId: locationIds,
    width: "100%",
  };
  const zoneOptions: DefaultNumberArrayOptionProps = {
    setId: setZoneIds,
    currentId: zoneIds,
    width: "100%",
  };
  const typeSelectorOptions: TypeSelectorOptionProps = {
    entityType: "Machine",
    setTypeId: setTypeIds,
    currentId: typeIds,
    rounded: true,
    multiple: true,
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
    value: filter.department,
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
    value: filter.brand,
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
    value: filter.engine,
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
    value: filter.measurement,
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
    flag: filter.isAssigned,
    name: "Show all assigned machinery",
  };
  const isIncompleteChecklistTaskOptions: DefaultBooleanOptionProps = {
    onChange: (isIncompleteChecklistTask: CheckboxChangeEvent) => {
      setFilter({
        ...filter,
        isIncompleteChecklistTask: isIncompleteChecklistTask?.target?.checked,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setIsIncompleteChecklistTask(isIncompleteChecklistTask?.target?.checked);
    },
    flag: filter.isIncompleteChecklistTask,
    name: "Show all machinery with incomplete checklist",
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
        status: status,
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
    isIncompleteChecklistTaskOptions,
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
        <FilterOptions options={filterOptions} onClick={clearAll} />
      </div>
    </>
  );
};

export default Machinery;
