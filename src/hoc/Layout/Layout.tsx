import AntLayout from "antd/lib/layout";
import { memo, useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { LeftOutlined } from "@ant-design/icons";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import PageTopButton from "../../components/common/PageTopButton/PageTopButton";

const Layout = ({ children }: any) => {
  const isSmallDevice = useIsSmallDevice();
  const [collapsed, setCollapsed] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender && isSmallDevice) {
      setCollapsed(true);
      setFirstRender(false);
    }
  }, [firstRender, isSmallDevice]);

  const { Sider, Content } = AntLayout;

  return (
    <AntLayout style={{ overflow: "hidden", height: "100%" }}>
      <Sider
        style={{
          position: isSmallDevice ? "absolute" : undefined,
          zIndex: isSmallDevice ? 5 : undefined,
        }}
        width={isSmallDevice ? "100%" : "230"}
        trigger={null}
        breakpoint="md"
        collapsedWidth="0"
        collapsed={collapsed}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "auto",
            height: isSmallDevice ? "100vh" : "100%",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--navbar)",
                height: 50,
              }}
            >
              <img
                style={{ width: "2.5rem" }}
                src="/avatar.jpg"
                alt="usagi5677"
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
            padding: isSmallDevice ? "1rem 1rem" : "1rem",
            overflow: "auto",
          }}
          id={"content"}
        >
          {children}
          <PageTopButton />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default memo(Layout);
