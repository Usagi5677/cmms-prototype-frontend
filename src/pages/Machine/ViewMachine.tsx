import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import classes from "./ViewMachine.module.css";
import { Tabs, Button, Row, Col,Checkbox, Layout, Card, Dropdown, Menu, message, TimePicker, Table, Tag, Divider } from 'antd';
import { ImCross } from "react-icons/im";
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;

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


const ViewMachine = () => (
  <div className={classes["machinaries-container"]}>
  <Row className='machinaries-container'>
  <Col span={16}>
  <Button>Back</Button>
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Checksheets" key="1">
      <Row>
        <Col span={8}>
          <ul>
          <h1>Daily</h1>
          <Button type="text"><ImCross/> </Button> <Checkbox onChange={onChange}>Check Water Seperator</Checkbox>
          </ul>
        </Col>
        <Col span={8}>
          <ul>
          <h1>Weekly</h1>
          <Button type="text"><ImCross/> </Button> <Checkbox onChange={onChange}>Deep clean machine</Checkbox>
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
  );
  
  export default ViewMachine;
