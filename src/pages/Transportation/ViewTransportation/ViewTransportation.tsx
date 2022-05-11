import { LeftOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button, Spin, Tabs } from "antd";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { GET_SINGLE_TRANSPORTATION } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import classes from "./ViewTransportation.module.css";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import Transportation from "../../../models/Transportation";
import EditTransportation from "../../../components/TransportationComponents/EditTransportation/EditTransportation";
import DeleteTransportation from "../../../components/TransportationComponents/DeleteTransportation/DeleteTransportation";
import TransportationStatuses from "../../../components/TransportationComponents/TransportationStatuses/TransportationStatuses";
import ViewChecklist from "./ViewChecklist/ViewChecklist";
import ViewPeriodicMaintenance from "./ViewPeriodicMaintenance/ViewPeriodicMaintenance";
import ViewSparePR from "./ViewSparePR/ViewSparePR";
import ViewRepair from "./ViewRepair/ViewRepair";
import ViewBreakdown from "./ViewBreakdown/ViewBreakdown";

const ViewTransportation = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();

  const [
    getSingleTransportation,
    { data: transportation, loading: loadingTransportation },
  ] = useLazyQuery(GET_SINGLE_TRANSPORTATION, {
    onError: (err) => {
      errorMessage(err, "Error loading request.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  // Fetch machine when component mount
  useEffect(() => {
    getSingleTransportation({ variables: { transportationId: parseInt(id) } });
  }, [getSingleTransportation, id]);

  const transportationData: Transportation = transportation?.getSingleTransportation;

  const transportationEditData = {
    id: transportationData?.id,
    machineNumber: transportationData?.machineNumber,
    model: transportationData?.model,
    type: transportationData?.type,
    department: transportationData?.department,
    location: transportationData?.location,
    currentMileage: transportationData?.currentMileage,
    lastServiceMileage: transportationData?.lastServiceMileage,
    engine: transportationData?.engine,
    measurement: transportationData?.measurement,
    transportType: transportationData?.transportType,
    registeredDate: transportationData?.registeredDate,
  };

  return (
    <>
      <div className={classes["container"]}>
        <div className={classes["first-wrapper"]}>
          <div className={classes["tab-container"]}>
            <div className={classes["view-ticket-wrapper__header"]}>
              <Button
                className={classes["custom-btn-secondary"]}
                onClick={() => navigate(-1)}
                icon={<LeftOutlined />}
              >
                Back
              </Button>
              <div className={classes["tab-header-wrapper"]}>
                <div className={classes["tab-header"]}>
                  {transportationData?.machineNumber}
                </div>
              </div>
              <div style={{ width: 28 }}>{loadingTransportation && <Spin />}</div>
            </div>
            <Tabs
              defaultActiveKey="checklist"
              style={{
                flex: 1,
              }}
            >
              <Tabs.TabPane tab="Checklist" key="checklist">
                <ViewChecklist transportationData={transportationData} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Periodic Maintenance"
                key="periodicMaintenance"
              >
                <ViewPeriodicMaintenance transportationID={transportationData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Spare PR" key="sparePR">
                <ViewSparePR transportationID={transportationData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Repair" key="repair">
                <ViewRepair transportationID={transportationData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Breakdown" key="breakdown">
                <ViewBreakdown transportationID={transportationData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="History" key="history">
                
              </Tabs.TabPane>
              <Tabs.TabPane tab="Gallery" key="gallery">
                
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className={classes["info-container"]}>
            <div className={classes["info-btn-wrapper"]}>
              <EditTransportation transportation={transportationEditData} />
              <DeleteTransportation transportationID={transportationData?.id} />
            </div>

            <div className={classes["info-title-wrapper"]}>
              <div>Machine ID</div>
              <div className={classes["info-content"]}>{transportationData?.id}</div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Machine Number</div>
              <div className={classes["info-content"]}>
                {transportationData?.machineNumber}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Model</div>
              <div className={classes["info-content"]}>
                {transportationData?.model}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Type</div>
              <div className={classes["info-content"]}>{transportationData?.type}</div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Department</div>
              <div className={classes["info-content"]}>{transportationData?.department}</div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Location</div>
              <div className={classes["info-content"]}>
                {transportationData?.location}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Current mileage</div>
              <div className={classes["info-content"]}>
                {transportationData?.currentMileage}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Last service mileage</div>
              <div className={classes["info-content"]}>
                {transportationData?.lastServiceMileage}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Inter service mileage</div>
              <div className={classes["info-content"]}>
                {transportationData?.interServiceMileage}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Engine</div>
              <div className={classes["info-content"]}>
                {transportationData?.engine}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Measurement</div>
              <div className={classes["info-content"]}>
                {transportationData?.measurement}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Transport type</div>
              <div className={classes["info-content"]}>
                {transportationData?.transportType}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Registered date</div>
              <div className={classes["info-content"]}>
                {moment(transportationData?.registeredDate).format(
                  DATETIME_FORMATS.DAY_MONTH_YEAR
                )}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Status</div>
              <div className={classes["info-content"]}>
                <TransportationStatuses
                  transportationStatus={transportationData?.status}
                  transportationID={transportationData?.id}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classes["usage-container"]}></div>
      </div>
    </>
  );
};

export default ViewTransportation;