import { LeftOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button, Spin, Tabs } from "antd";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { GETSINGLEMACHINE } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import classes from "./ViewMachine.module.css";
import Machine from "../../../models/Machine";
import EditMachine from "../../../components/MachineComponents/EditMachine/EditMachine";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import DeleteMachine from "../../../components/MachineComponents/DeleteMachine/DeleteMachine";
import AddMachineChecklist from "../../../components/MachineComponents/AddMachineChecklist/AddMachineChecklist";
import MachineChecklistItem from "../../../components/MachineComponents/MachineChecklistItem/MachineChecklistItem";
import AddMachinePeriodicMaintenance from "../../../components/MachineComponents/AddMachinePeriodicMaintenance/AddMachinePeriodicMaintenance";
import MachinePeriodicMaintenanceCard from "../../../components/MachineComponents/MachinePeriodicMaintenanceCard/MachinePeriodicMaintenanceCard";
import ViewPeriodicMaintenance from "./ViewPeriodicMaintenance/ViewPeriodicMaintenance";
import ViewSparePR from "./ViewSparePR/ViewSparePR";
import ViewRepair from "./ViewRepair/ViewRepair";

const ViewMachine = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();

  const [
    getSingleMachine,
    { data: machine, loading: loadingMachine, refetch: refetchMachine },
  ] = useLazyQuery(GETSINGLEMACHINE, {
    onError: (err) => {
      errorMessage(err, "Error loading request.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  // Fetch machine when component mount
  useEffect(() => {
    getSingleMachine({ variables: { machineId: parseInt(id) } });
  }, [getSingleMachine, id]);

  const machineData: Machine = machine?.getSingleMachine;
  const machineEditData = {
    id: machineData?.id,
    machineNumber: machineData?.machineNumber,
    model: machineData?.model,
    type: machineData?.type,
    zone: machineData?.zone,
    location: machineData?.location,
    currentRunningHrs: machineData?.currentRunningHrs,
    lastServiceHrs: machineData?.lastServiceHrs,
    registeredDate: machineData?.registeredDate,
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
                  {machineData?.machineNumber}
                </div>
              </div>
              <div style={{ width: 28 }}>{loadingMachine && <Spin />}</div>
            </div>
            <Tabs
              defaultActiveKey="checklists"
              style={{
                flex: 1,
              }}
            >
              <Tabs.TabPane tab="Checklists" key="checklists">
                <div className={classes["checklist-container"]}>
                  <div className={classes["checklist-options"]}>
                    <AddMachineChecklist machineID={machineData?.id} />
                  </div>
                  <div className={classes["checklist-content"]}>
                    <div className={classes["checklist-content-wrapper"]}>
                      <div className={classes["checklist-content-title"]}>
                        Daily
                      </div>
                      {machineData?.checklistItems.map((item) =>
                        item.type === "Daily" ? (
                          <MachineChecklistItem key={item.id} item={item} />
                        ) : null
                      )}
                    </div>
                    <div className={classes["checklist-content-wrapper"]}>
                      <div className={classes["checklist-content-title"]}>
                        Weekly
                      </div>
                      {machineData?.checklistItems.map((item) =>
                        item.type === "Weekly" ? (
                          <MachineChecklistItem key={item.id} item={item} />
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Periodic Maintenance"
                key="periodicMaintenance"
              >
                <ViewPeriodicMaintenance machineID={machineData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Spare PR" key="sparePR">
                <ViewSparePR machineID={machineData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Repair" key="repair">
                <ViewRepair machineID={machineData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Breakdown" key="breakdown">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    fontSize: 12,
                  }}
                >
                  tab 5
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="History" key="history">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    fontSize: 12,
                  }}
                >
                  tab 6
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Gallery" key="gallery">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    fontSize: 12,
                  }}
                >
                  tab 7
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className={classes["info-container"]}>
            <div className={classes["info-btn-wrapper"]}>
              <EditMachine machine={machineEditData} />
              <DeleteMachine machineID={machineData?.id} />
            </div>

            <div className={classes["info-title-wrapper"]}>
              <div>Machine ID</div>
              <div className={classes["info-content"]}>{machineData?.id}</div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Machine Number</div>
              <div className={classes["info-content"]}>
                {machineData?.machineNumber}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Model</div>
              <div className={classes["info-content"]}>
                {machineData?.model}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Type</div>
              <div className={classes["info-content"]}>{machineData?.type}</div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Zone</div>
              <div className={classes["info-content"]}>{machineData?.zone}</div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Location</div>
              <div className={classes["info-content"]}>
                {machineData?.location}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Current running hrs</div>
              <div className={classes["info-content"]}>
                {machineData?.currentRunningHrs}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Last service hrs</div>
              <div className={classes["info-content"]}>
                {machineData?.lastServiceHrs}
              </div>
            </div>
            <div className={classes["info-title-wrapper"]}>
              <div>Registered date</div>
              <div className={classes["info-content"]}>
                {moment(machineData?.registeredDate).format(
                  DATETIME_FORMATS.DAY_MONTH_YEAR
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={classes["usage-container"]}></div>
      </div>
    </>
  );
};

export default ViewMachine;

/*
function callback(key: any) {
  console.log(key);
}

function onChange(e: { target: { checked: any; }; }) {
  console.log(`checked = ${e.target.checked}`);
}

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

const menu = (
  <Menu

  />
);

const sparePR = [
  {
    title: 'Requested_Date',
    dataIndex: 'requested_date',
    key: 'requested_date',
    render: (text: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => <a>{text}</a>,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
  },

  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: { requested_date: any }) => (
      <span>
        <a>Edit</a>
      </span>
    ),
  },
];
const repair = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => <a>{text}</a>,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
  },

  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: { requested_date: any }) => (
      <span>
        <a>Edit</a>
      </span>
    ),
  },
];
const breakdown = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => <a>{text}</a>,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
  },

  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: { requested_date: any }) => (
      <span>
        <a>Edit</a>
      </span>
    ),
  },
];
const history = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => <a>{text}</a>,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: { requested_date: any }) => (
      <span>
        <a>Edit</a>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    requested_date: '11/11/11',
    title: 'PR213213',
    description: '02/2/2222 PO SENT TO SUPPLIER 25.11.2222 DELIVERY',
    status: ['Done'],
  },

];

*/

/*
<div className={classes["machinaries-container"]}>
  <Row className='machinaries-container'>
  <Col span={16}>
  <Button>Back</Button>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Checksheets" key="1">
      <Row>
        <Col span={8}>
          <ul>
          <h1>Daily</h1>
          <Button type="text"><ImCross/> </Button> <Checkbox >Check Water Seperator</Checkbox>
          </ul>
        </Col>
        <Col span={8}>
          <ul>
          <h1>Weekly</h1>
          <Button type="text"><ImCross/> </Button> <Checkbox >Deep clean machine</Checkbox>
          </ul>
        </Col>
        <Col span={3} style={{float: 'right'}}>
          <ul>
          <Button style={{float: 'right', margin:'0 20px'}} >Add Checklist</Button>
          </ul>
        </Col>
      </Row>
      </TabPane>

      <TabPane tab="Scheduled Maintenance" key="2">
        <Row>
        <Col span={24} style={{float: 'right'}}>
          <ul>
          <Button style={{float: 'right', margin:'5px 20px', padding:''}} >Add Checklist</Button>
          </ul>
        </Col>
        </Row>
      <Card title="" extra={<><Button>Edit</Button><Button>Delete</Button></>} style={{width:'800px'}}>
        <Row gutter={12}>
        <Col className="gutter-row" span={12}>
        <div>
          <ul>
            <li><h2>1- Change Lube Oil</h2></li>
            <li>Replace oil filter element</li>
            <li>Completed by Ibrahim Naish</li>
          </ul>
        </div>
        </Col>
        <Col className="gutter-row" span={5}>
        <div><Button style={{margin:'5px 0px'}}>Done <DownOutlined/></Button></div>
        <div><TimePicker  style={{margin:'5px 0px'}} defaultOpenValue={moment('00:00:00', 'HH:mm')} format="HH:mm" /></div>
        <div><TimePicker style={{margin:'5px 0px'}} defaultOpenValue={moment('00', 'mm')}format="mm" /></div>
        </Col>
        </Row>
        </Card>

      </TabPane>
      <TabPane tab="Spare PR" key="3">
      <Table columns={sparePR} dataSource={data} />
      </TabPane>
      <TabPane tab="Repair" key="4">
      <Table columns={repair} dataSource={data} />
      </TabPane>
      <TabPane tab="Breakdown" key="5">
      <Table columns={breakdown} dataSource={data} />
      </TabPane>
      <TabPane tab="History" key="6">
      <Table columns={history} dataSource={data} />
      </TabPane>

      <TabPane tab="Gallery" key="7">
        <Col span={3} style={{float: 'right'}}>
        <ul>
        <Button style={{float: 'right', margin:'0 20px'}} >Add Image</Button>
        </ul>
        </Col>
        <Card
    hoverable
    style={{ width: 240 }}
    cover={<img alt="example" src="https://static5.depositphotos.com/1008791/479/i/950/depositphotos_4797566-stock-photo-mobile-crane-white-background-isolated.jpg" />}
  ></Card>
      </TabPane>
    </Tabs>
  </Col>
  
  <Col span={5}>
  <Card title="Machine Info" bordered={true}>
          <ul>
            <li>ID:</li>
            <li>Machine Number:</li>
            <li>Registered Date:</li>
            <li>Model:</li>
            <li>Type:</li>
            <li>Zone:</li>
            <li>Location:</li>
            <li>Current running(hrs):</li>
            <li>Last service(hrs):</li>
            <li>Inter service(hrs):</li>
            <li>Status:<span className={classes["machinaries-wrapper__machinaries-activity__status"]}> Working</span>
            </li>
          </ul>
        </Card>
  </Col>
  </Row>
  </div>

*/
