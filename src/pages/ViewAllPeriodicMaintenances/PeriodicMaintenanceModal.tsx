import { Tooltip, Modal, Form, Input, Row, Col, Button } from "antd";
import form from "antd/lib/form";
import moment from "moment";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../helpers/constants";
import classes from "./PeriodicMaintenanceModal.module.css";

const PeriodicMaintenanceModal = ({ summary }: { summary?: any }) => {
  const [visible, setVisible] = useState(false);
  const handleCancel = () => {
    //form.resetFields();
    setVisible(false);
  };
  return (
    <>
      <div className={classes["info-edit"]}>
        <div onClick={() => setVisible(true)}>{summary.id}</div>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={`Maintenance (${summary.id})`}
          width="90vw"
          style={{ maxWidth: 700 }}
          destroyOnClose
        >
          <Form layout="vertical" name="basic" id="myForm">
            <div className={classes["row"]}>
              <div className={classes["col"]}>
                <div>ID: {summary.id}</div>
                <div>
                  From: {moment(summary.from).format(DATETIME_FORMATS.FULL)}
                </div>
                <div>To: {moment(summary.to).format(DATETIME_FORMATS.FULL)}</div>
                <div>Type: {summary.type}</div>
                <div>Entity ID: {summary.entityId}</div>
                <div>
                  Current meter reading:{" "}
                  {summary.currentMeterReading ? "Exist" : "None"}
                </div>
                <div>Remark: {summary.hasRemarks ? "Exist" : "None"}</div>
                <div>
                  Observation: {summary.hasObservations ? "Exist" : "None"}
                </div>
                <div>Verify: {summary.hasVerify ? "Exist" : "None"}</div>
                <div>Task Completion: {summary.taskCompletion}</div>
              </div>
            </div>
            <Row justify="end" gutter={16}>
              <Col>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="ghost"
                    onClick={handleCancel}
                    className={classes["custom-btn-secondary"]}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default PeriodicMaintenanceModal;
