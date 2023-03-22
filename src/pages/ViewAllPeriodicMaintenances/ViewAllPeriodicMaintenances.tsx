import { Breadcrumb, Button, Empty, Result, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PaginationArgs from "../../models/PaginationArgs";
import { errorMessage } from "../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { ALL_PERIODIC_MAINTENANCE_LIST } from "../../api/queries";
import PaginationButtons from "../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAllPeriodicMaintenances.module.css";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import { motion } from "framer-motion";
import {
  DefaultDateOptionProps,
  DefaultNumberArrayOptionProps,
  DefaultStringArrayOptionProps,
  FilterOptionProps,
  PeriodicMaintenanceStatus,
  PMStatusOptionProps,
  SearchOptionProps,
  SearchReadingOptionProps,
  TypeSelectorOptionProps,
} from "../../models/Enums";
import { useLocalStorage } from "../../helpers/useLocalStorage";
import MaintenanceFilterOptions from "../../components/common/MaintenanceFilterOptions/MaintenanceFIlterOptions";
import moment from "moment";
import EntityCard from "../../components/EntityComponents/EntityCard/EntityCard";
import { Entity } from "../../models/Entity/Entity";
import MaintenanceProgressBar from "../../components/common/MaintenanceProgressBar/MaintenanceProgressBar";
import { hasPermissions } from "../../helpers/permissions";
import UserContext from "../../contexts/UserContext";
import { NO_AUTH_MESSAGE_TWO } from "../../helpers/constants";

const ViewAllPeriodicMaintenances = () => {
  const getFilter = localStorage.getItem("periodicMaintenancesFilter");
  let getFilterObjects: any;
  if (getFilter) {
    getFilterObjects = JSON.parse(JSON.parse(getFilter));
  }
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [timerId, setTimerId] = useState(null);
  const [search, setSearch] = useState(getFilterObjects?.search);
  const [locationIds, setLocationIds] = useState<number[]>(
    getFilterObjects?.locationIds
  );
  const [type2Ids, setType2Ids] = useState<number[]>(
    getFilterObjects?.type2Ids
  );
  const [zoneIds, setZoneIds] = useState<number[]>(getFilterObjects?.zoneIds);
  const [divisionIds, setDivisionIds] = useState<number[]>(
    getFilterObjects?.divisionIds
  );
  const [measurement, setMeasurement] = useState<string[]>(
    getFilterObjects?.measurement
  );
  const [lteInterService, setLteInterService] = useState(
    getFilterObjects?.lteInterService
  );
  const [gteInterService, setGteInterService] = useState(
    getFilterObjects?.gteInterService
  );
  const [pmStatus, setPMStatus] = useState<PeriodicMaintenanceStatus[]>(
    getFilterObjects?.pmStatus
  );
  const [to, setTo] = useState<any>(moment(getFilterObjects?.to));
  const [from, setFrom] = useState<any>(moment(getFilterObjects?.from));

  const [saveFilterOptions, setSaveFilterOptions] = useLocalStorage(
    "periodicMaintenancesFilter",
    JSON.stringify({
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      type2Ids: [],
      zoneIds: [],
      divisionIds: [],
      //assignedToId: null,
      measurement: [],
      lteInterService: "",
      gteInterService: "",
      pmStatus: [],
      from: moment(),
      to: moment(),
    })
  );
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      locationIds: number[];
      type2Ids: number[];
      zoneIds: number[];
      divisionIds: number[];
      measurement: string[];
      lteInterService: string;
      gteInterService: string;
      pmStatus: PeriodicMaintenanceStatus[];
      from: any;
      to: any;
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: JSON.parse(saveFilterOptions)?.search,
    locationIds: JSON.parse(saveFilterOptions)?.locationIds,
    type2Ids: JSON.parse(saveFilterOptions)?.type2Ids,
    zoneIds: JSON.parse(saveFilterOptions)?.zoneIds,
    divisionIds: JSON.parse(saveFilterOptions)?.divisionIds,
    measurement: JSON.parse(saveFilterOptions)?.measurement,
    lteInterService: JSON.parse(saveFilterOptions)?.lteInterService,
    gteInterService: JSON.parse(saveFilterOptions)?.gteInterService,
    pmStatus: JSON.parse(saveFilterOptions)?.pmStatus,
    from: JSON.parse(saveFilterOptions)?.from,
    to: JSON.parse(saveFilterOptions)?.to,
  });

  const [getAllPMWithPagination, { data, loading }] = useLazyQuery(
    ALL_PERIODIC_MAINTENANCE_LIST,
    {
      onError: (err) => {
        errorMessage(err, "Error loading maintenances.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  /*
  const [
    allPeriodicMaintenanceSummary,
    { data: allSummary, loading: loading2 },
  ] = useLazyQuery(ALL_PERIODIC_MAINTENANCE_SUMMARIES, {
    onError: (err) => {
      errorMessage(err, "Error loading maintenance summary.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });
  */
  // Fetch when component mounts or when the filter object changes
  useEffect(() => {
    getAllPMWithPagination({ variables: filter });
    setSaveFilterOptions(JSON.stringify(filter));
    //allPeriodicMaintenanceSummary({ variables: filter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, getAllPMWithPagination, from, to]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationIdsValue: number[],
    type2IdsValue: number[],
    zoneIdsValue: number[],
    divisionIdsValue: number[],
    measurementValue: string[],
    lteInterServiceValue: string,
    gteInterServiceValue: string,
    pmStatusValue: PeriodicMaintenanceStatus[],
    fromValue: any,
    toValue: any
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          locationIds: locationIdsValue,
          type2Ids: type2IdsValue,
          zoneIds: zoneIdsValue,
          divisionIds: divisionIdsValue,
          measurement: measurementValue,
          lteInterService: lteInterServiceValue,
          gteInterService: gteInterServiceValue,
          pmStatus: pmStatusValue,
          from: fromValue,
          to: toValue,
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
      type2Ids,
      zoneIds,
      divisionIds,
      measurement,
      lteInterService,
      gteInterService,
      pmStatus,
      from,
      to
    );
    // eslint-disable-next-line
  }, [
    search,
    locationIds,
    type2Ids,
    zoneIds,
    divisionIds,
    measurement,
    lteInterService,
    gteInterService,
    pmStatus,
    from,
    to,
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

  const pageInfo = data?.getAllPMWithPagination.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  const clearAll = () => {
    const clearFilter = {
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      typeIds: [],
      zoneIds: [],
      divisionIds: [],
      measurement: [],
      lteInterService: "",
      gteInterService: "",
      pmStatus: [],
    };
    setSaveFilterOptions(JSON.stringify(clearFilter));

    setSearch("");
    setLocationIds([]);
    setType2Ids([]);
    setZoneIds([]);
    setDivisionIds([]);
    setMeasurement([]);
    setLteInterService("");
    setGteInterService("");
    setPMStatus([]);
  };

  const searchOptions: SearchOptionProps = {
    searchValue: search,
    onChange: (e) => setSearch(e.target.value),
    onClick: () => setSearch(""),
    width: "100%",
  };

  const lteInterServiceOptions: SearchReadingOptionProps = {
    searchValue: lteInterService,
    onChange: (e) => setLteInterService(e.target.value),
    onClick: () => setLteInterService(""),
    width: "100%",
  };
  const gteInterServiceOptions: SearchReadingOptionProps = {
    searchValue: gteInterService,
    onChange: (e) => setGteInterService(e.target.value),
    onClick: () => setGteInterService(""),
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
    setTypeId: setType2Ids,
    currentId: type2Ids,
    rounded: true,
    multiple: true,
    width: "100%",
  };
  const divisionOptions: DefaultNumberArrayOptionProps = {
    setId: setDivisionIds,
    currentId: divisionIds,
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

  const pmStatusOptions: PMStatusOptionProps = {
    onChange: (status) => {
      setFilter({
        ...filter,
        pmStatus: status,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setPMStatus(status);
    },
    value: filter.pmStatus,
    width: "100%",
  };

  const fromOptions: DefaultDateOptionProps = {
    onChange: (from: any) => {
      setFilter({
        ...filter,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setFrom(from);
    },
    value: from,
    width: "100%",
  };

  const toOptions: DefaultDateOptionProps = {
    onChange: (to: any) => {
      setFilter({
        ...filter,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setTo(to);
    },
    value: to,
    width: "100%",
  };

  const filterOptions: FilterOptionProps = {
    searchOptions,
    locationOptions,
    typeSelectorOptions,
    zoneOptions,
    divisionOptions,
    measurementOptions,
    lteInterServiceOptions,
    gteInterServiceOptions,
    pmStatusOptions,
    fromOptions,
    toOptions,
  };

  return self?.machineAssignments.length === 0 &&
    self?.vehicleAssignments.length === 0 &&
    self?.vesselAssignments.length === 0 &&
    !hasPermissions(self, ["VIEW_ALL_ENTITY"]) &&
    !hasPermissions(self, ["VIEW_ALL_MACHINERY"]) &&
    !hasPermissions(self, ["VIEW_ALL_VEHICLES"]) &&
    !hasPermissions(self, ["VIEW_ALL_VESSELS"]) &&
    !hasPermissions(self, ["VIEW_ALL_DIVISION_ENTITY"]) ? (
    <Result
      status="403"
      title="403"
      subTitle={NO_AUTH_MESSAGE_TWO}
      extra={
        <Button
          type="primary"
          onClick={() => `${window.open("https://helpdesk.mtcc.com.mv/")}`}
          style={{ borderRadius: 2 }}
        >
          Get Help
        </Button>
      }
    />
  ) : (
    <>
      <Breadcrumb style={{ marginBottom: 6 }}>
        <Breadcrumb.Item>
          <Link to={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Maintenances</Breadcrumb.Item>
      </Breadcrumb>
      <MaintenanceProgressBar filter={filter} />
      <div className={classes["wrapper"]}>
        <div className={classes["container"]}>
          {/*<div className={classes["options-wrapper"]}>
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
            <AllPeriodicMaintenanceCalendar
              summary={allSummary}
              loading={loading2}
            />
          </div>
        </motion.div>
      </div> */}
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
              <Link to={"/maintenances/calendar"}>
                <Button
                  htmlType="button"
                  size="middle"
                  type="primary"
                  className="custPrimaryButton"
                >
                  Calendar
                </Button>
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div>
              <Spin style={{ width: "100%", margin: "2rem auto" }} />
            </div>
          ) : data?.getAllPMWithPagination.edges.length > 0 ? (
            <div>
              {data?.getAllPMWithPagination.edges.map(
                (rec: { node: Entity }) => {
                  const entity = rec.node;
                  return (
                    <EntityCard
                      entity={entity}
                      key={entity.id}
                      includePM={entity?.periodicMaintenances}
                    />
                  );
                }
              )}
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
        <MaintenanceFilterOptions options={filterOptions} onClick={clearAll} />
      </div>
    </>
  );
};

export default ViewAllPeriodicMaintenances;
