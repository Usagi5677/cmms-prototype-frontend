import AntLayout from "antd/lib/layout";
import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { LeftOutlined } from "@ant-design/icons";

const Layout = ({ children }: any) => {
  const [siderStyle, setSiderStyle] = useState<any>({ flex: 1 });
  const [width, setWidth] = useState("230");
  const [collapsed, setCollapsed] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  const { Sider, Content } = AntLayout;

  const onBreakpoint = (broken: boolean) => {
    if (broken) {
      setSiderStyle({
        ...siderStyle,
        position: "absolute",
        zIndex: 5,
      });
      setWidth("100%");
      setIsSmallDevice(true);
    } else {
      setWidth("230");
      setIsSmallDevice(false);
    }
  };

  return (
    <AntLayout style={{ overflow: "hidden", height: "100%" }}>
      <Sider
        style={siderStyle}
        width={width}
        trigger={null}
        breakpoint="md"
        collapsedWidth="0"
        collapsed={collapsed}
        onBreakpoint={onBreakpoint}
        theme="light"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "auto",
            height: "100%",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgb(36, 218, 157)",
                height: 50,
              }}
            >
              <img
                style={{ width: "8.5rem" }}
                src="/logo.png"
                alt="MTCC Logo"
              />
            </div>
            <Sidebar onClick={() => setCollapsed(isSmallDevice && true)} />
          </div>
          {isSmallDevice && (
            <div
              onClick={() => setCollapsed(true)}
              className="ant-layout-sider-trigger"
              style={{ width: "100%", position: "initial" }}
            >
              <LeftOutlined />
            </div>
          )}
        </div>
      </Sider>
      <AntLayout>
        <Navbar openSidebar={() => setCollapsed(!collapsed)} />
        <Content
          style={{
            padding: isSmallDevice ? "2rem 1rem" : "1rem",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;