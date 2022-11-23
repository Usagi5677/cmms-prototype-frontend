import { Modal, Form, Row, Col, Button, Badge } from "antd";
import moment from "moment";
import { memo, useState } from "react";
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
        <div onClick={() => setVisible(true)}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div id={"mediumCircle"}>
              <Badge
                dot
                color={
                  summary?.status === "Completed"
                    ? "var(--working-color)"
                    : summary?.status === "Overdue"
                    ? "var(--breakdown-color)"
                    : summary?.status === "Upcoming"
                    ? "var(--upcoming-color)"
                    : "var(--ongoing-color)"
                }
                text={summary.id}
              />
            </div>
          </div>
        </div>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={`Maintenance (${summary.id})`}
          width="90vw"
          style={{ maxWidth: 700 }}
          destroyOnClose
        >
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <div>ID: {summary.id}</div>
              <div>
                From: {moment(summary.from).format(DATETIME_FORMATS.FULL)}
              </div>
              <div>To: {moment(summary.to).format(DATETIME_FORMATS.FULL)}</div>
              <div>Entity ID: {summary.entityId}</div>
              <div>Task Completion: {summary.taskCompletion}</div>
              <div>Verify: {summary.hasVerify ? "Exist" : "None"}</div>
              <div>
                Current meter reading:{" "}
                {summary.currentMeterReading ? "Exist" : "None"}
              </div>
              <div>Remark: {summary.hasRemarks ? "Exist" : "None"}</div>
              <div>
                Observation: {summary.hasObservations ? "Exist" : "None"}
              </div>
              <div>Status: {summary?.status}</div>
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
        </Modal>
      </div>
    </>
  );
};

export default memo(PeriodicMaintenanceModal);
