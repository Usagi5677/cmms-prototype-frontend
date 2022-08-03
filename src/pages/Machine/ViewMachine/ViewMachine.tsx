import { CloseCircleOutlined, LeftOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Avatar, Button, message, Spin, Tabs, Tooltip, Image } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  GET_MACHINE_LATEST_ATTACHMENT,
  GET_SINGLE_MACHINE,
} from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import classes from "./ViewMachine.module.css";
import Machine from "../../../models/Machine";
import EditMachine from "../../../components/MachineComponents/EditMachine/EditMachine";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import DeleteMachine from "../../../components/MachineComponents/DeleteMachine/DeleteMachine";
import ViewPeriodicMaintenance from "./ViewPeriodicMaintenance/ViewPeriodicMaintenance";
import ViewSparePR from "./ViewSparePR/ViewSparePR";
import ViewRepair from "./ViewRepair/ViewRepair";
import ViewBreakdown from "./ViewBreakdown/ViewBreakdown";
import MachineStatuses from "../../../components/MachineComponents/MachineStatuses/MachineStatuses";
import ViewHistory from "./ViewHistory/ViewHistory";
import ViewGallery from "./ViewGallery/ViewGallery";
import ViewChecklist from "./ViewChecklist/ViewChecklist";
import UserContext from "../../../contexts/UserContext";
import { stringToColor } from "../../../helpers/style";
import MachineAssignment from "../../../components/MachineComponents/MachineAssignment/MachineAssignment";
import { UNASSIGN_USER_FROM_MACHINE } from "../../../api/mutations";
import MachineUsageHistory from "../../../components/MachineComponents/MachineUsageHistory/MachineUsageHistory";
import EditMachineUsage from "../../../components/MachineComponents/EditMachineUsage/EditMachineUsage";
import GetLatestMachineImage from "../../../components/MachineComponents/GetLatestMachineImage/GetLatestMachineImage";
import { FaMapMarkerAlt, FaTractor } from "react-icons/fa";
import EditMachineLocation from "../../../components/MachineComponents/EditMachineLocation/EditMachineLocation";

const ViewMachine = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();
  const { user: self } = useContext(UserContext);
  const [getSingleMachine, { data: machine, loading: loadingMachine }] =
    useLazyQuery(GET_SINGLE_MACHINE, {
      onError: (err) => {
        errorMessage(err, "Error loading request.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    });

  // Fetch machine when component mount
  useEffect(() => {
    if (!self.assignedPermission.hasViewMachine) {
      navigate("/");
      message.error("No permission to view machine.");
    }

    getSingleMachine({ variables: { machineId: parseInt(id) } });
  }, [getSingleMachine, id]);

  const [unassignUserFromMachine, { loading: unassigning }] = useMutation(
    UNASSIGN_USER_FROM_MACHINE,
    {
      onCompleted: () => {
        message.success("Successfully unassigned user from machine.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while unassigning user.");
      },
      refetchQueries: ["getSingleMachine", "getAllHistoryOfMachine"],
    }
  );

  const machineData: Machine = machine?.getSingleMachine;

  const renderUsers = () => {
    return (
      machineData?.assignees?.length! > 0 && (
        <Avatar.Group
          maxCount={5}
          maxStyle={{
            color: "#f56a00",
            backgroundColor: "#fde3cf",
          }}
        >
          {machineData?.assignees?.map((assign) => {
            return (
              <Tooltip
                title={
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {assign?.user?.fullName} ({assign?.user?.rcno})
                      {self.assignedPermission.hasMachineUnassignmentToUser && (
                        <CloseCircleOutlined
                          style={{
                            cursor: "pointer",
                            marginLeft: 3,
                          }}
                          onClick={() =>
                            unassignUserFromMachine({
                              variables: {
                                machineId: machineData?.id,
                                userId: assign?.user?.id,
                              },
                            })
                          }
                        />
                      )}
                    </div>
                  </>
                }
                placement="bottom"
                key={assign?.user?.id}
              >
                <Avatar
                  style={{
                    backgroundColor: stringToColor(assign?.user?.fullName!),
                  }}
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
      )
    );
  };

  const [
    getMachineLatestAttachment,
    { data: attachmentData, loading: loadingImage, error },
  ] = useLazyQuery(GET_MACHINE_LATEST_ATTACHMENT, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch attachment when component mounts or when the filter object changes
  useEffect(() => {
    getMachineLatestAttachment({
      variables: {
        machineId: parseInt(id),
      },
    });
  }, [id, getMachineLatestAttachment]);

  return (
    <>
      <div className={classes["container"]}>
        <div className={classes["info-container"]}>
          <div className={classes["info-btn-wrapper"]}>
            {/* {self.assignedPermission.hasEditMachineUsage ? (
              <EditMachineUsage
                machine={machineData}
                isDeleted={machineData?.isDeleted}
              />
            ) : null} */}
            {self.assignedPermission.hasEditMachineLocation ? (
              <EditMachineLocation
                machine={machineData}
                isDeleted={machineData?.isDeleted}
              />
            ) : null}
            {self.assignedPermission.hasMachineEdit ? (
              <EditMachine
                machine={machineData}
                isDeleted={machineData?.isDeleted}
              />
            ) : null}
            {self.assignedPermission.hasMachineDelete ? (
              <DeleteMachine
                machineID={machineData?.id}
                isDeleted={machineData?.isDeleted}
              />
            ) : null}
          </div>
          {machineData?.isDeleted ? (
            <div className={classes["deleted"]}>DISPOSED</div>
          ) : null}
          <div className={classes["info-wrapper"]}>
            <div className={classes["location-wrapper"]}>
              <FaMapMarkerAlt />
              <span className={classes["title"]}>{machineData?.zone}</span>
              <span className={classes["dash"]}>-</span>
              <span>{machineData?.location}</span>
            </div>
          </div>
          <div className={classes["title-wrapper"]}>
            <FaTractor />
            <span className={classes["title"]}>
              {machineData?.machineNumber}
            </span>
          </div>
          <div className={classes["info-title-container"]}>
            <div className={classes["grid-one"]}>
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
                <div className={classes["info-content"]}>
                  {machineData?.type?.name}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Zone</div>
                <div className={classes["info-content"]}>
                  {machineData?.zone}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Assignments</div>
                <div className={classes["info-content"]}>
                  {self.assignedPermission.hasMachineAssignmentToUser &&
                  !machineData?.isDeleted ? (
                    <MachineAssignment machineID={machineData?.id} />
                  ) : (
                    <>{renderUsers()}</>
                  )}
                </div>
              </div>
              {self.assignedPermission.hasMachineAssignmentToUser &&
                renderUsers()}
            </div>
            <div className={classes["grid-two"]}>
              <div className={classes["info-title-wrapper"]}>
                <div>Current running {machineData?.measurement}</div>
                <div className={classes["info-content"]}>
                  {machineData?.currentRunning}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Last service {machineData?.measurement}</div>
                <div className={classes["info-content"]}>
                  {machineData?.lastService}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Inter service {machineData?.measurement}</div>
                <div className={classes["info-content"]}>
                  {(machineData?.currentRunning ?? 0) -
                    (machineData?.lastService ?? 0)}
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
              <div className={classes["info-title-wrapper"]}>
                <div>Status</div>
                <div className={classes["info-content"]}>
                  <MachineStatuses
                    machineStatus={machineData?.status}
                    machineID={machineData?.id}
                    isDeleted={machineData?.isDeleted}
                  />
                </div>
              </div>
            </div>
            <GetLatestMachineImage
              attachmentData={attachmentData?.getMachineLatestAttachment}
            />
          </div>
        </div>
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
              <div style={{ width: 28 }}>
                {loadingMachine || (unassigning && <Spin />)}
              </div>
            </div>
            <Tabs
              defaultActiveKey="checklist"
              style={{
                flex: 1,
              }}
            >
              <Tabs.TabPane tab="Checklist" key="checklist">
                <ViewChecklist
                  machineData={machineData}
                  isDeleted={machineData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Periodic Maintenance"
                key="periodicMaintenance"
              >
                <ViewPeriodicMaintenance
                  machineID={machineData?.id}
                  value={machineData?.currentRunning}
                  measurement={machineData?.measurement}
                  isDeleted={machineData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Spare PR" key="sparePR">
                <ViewSparePR
                  machineID={machineData?.id}
                  isDeleted={machineData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Repair" key="repair">
                <ViewRepair
                  machineID={machineData?.id}
                  isDeleted={machineData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Breakdown" key="breakdown">
                <ViewBreakdown
                  machineID={machineData?.id}
                  isDeleted={machineData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="History" key="history">
                <ViewHistory machineID={machineData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Gallery" key="gallery">
                <ViewGallery
                  machineID={machineData?.id}
                  isDeleted={machineData?.isDeleted}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
        <div className={classes["usage-container"]}>
          <MachineUsageHistory />
        </div>
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
