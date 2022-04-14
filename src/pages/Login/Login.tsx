import { Button, Card, Col, Divider, Row } from "antd";
import { UnlockOutlined } from "@ant-design/icons";

function getDate(): number {
  return new Date().getFullYear();
}

const Login = ({ login }: { login: () => void }) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url(/MTCC-Background.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Col
        style={{
          position: "absolute",
          minWidth: "23em",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card style={{ backgroundColor: "white" }}>
          <Row justify="center">
            <img height="240" src="/MTCC-logo.png" alt="" />
          </Row>
          <Row>
            <Button
              type={"primary"}
              icon={<UnlockOutlined style={{ fontSize: "14px" }} />}
              htmlType="button"
              block
              onClick={login}
            >
              Login
            </Button>
          </Row>
          <Row justify="center">
            <Divider style={{ borderTop: "1px solid rgba(0,0,0,.06)" }} />
            <small style={{ color: "black" }}>
              © {getDate()} MTCC Plc. All Rights Reserved.{" "}
            </small>
          </Row>
        </Card>
      </Col>
    </div>
  );
};

export default Login;
