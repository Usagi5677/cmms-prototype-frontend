import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import classes from "./Machinery.module.css";
import { Tabs, Button} from 'antd';
const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}
const ViewMachinaries = () => (
    <div className={classes["machinaries-container"]}>
    <Button>Back</Button>
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Checksheets" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Scheduled Maintenance" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="Spare PR" key="3">
        Content of Tab Pane 3
      </TabPane>
      <TabPane tab="Repair" key="4">
        Content of Tab Pane 4
      </TabPane>
      <TabPane tab="Breakdown" key="5">
        Content of Tab Pane 5
      </TabPane>
      <TabPane tab="History" key="6">
        Content of Tab Pane 6
      </TabPane>
      <TabPane tab="Gallery" key="7">
        Content of Tab Pane 7
      </TabPane>
    </Tabs>
    </div>
  );
  
  export default ViewMachinaries;
