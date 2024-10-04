import React, { useState } from "react";
import {
   MenuFoldOutlined,
   MenuUnfoldOutlined,
   LogoutOutlined,
   NotificationOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, ConfigProvider, Tooltip } from "antd";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import { admin } from "../../routes/routes";
import logo from "../../assets/images/logo.png";
const { Header, Sider, Content } = Layout;
const Index = () => {
   const [collapsed, setCollapsed] = useState(false);
   const {
      token: { colorBgContainer, borderRadiusLG },
   } = theme.useToken();
   return (
      <ConfigProvider
         theme={{
            token: {
               colorPrimary: "rgba(181,144,98,1)",
            },
         }}
      >
         <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
               <div
                  style={{
                     width: "100%",
                     height: "64px",
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                     cursor: "pointer",
                     marginBottom: "10px",
                  }}
               >
                  <img className="w-[40px]" src={logo} alt="logo" />
                  {!collapsed && (
                     <h1
                        style={{
                           color: "#fff",
                           fontSize: "18px",
                           fontWeight: "semibold",
                           marginLeft: "20px",
                        }}
                     >
                        Teacher
                     </h1>
                  )}
               </div>
               <Menu
                  theme="dark"
                  mode="inline"
                  defaultSelectedKeys={["1"]}
                  items={admin.map((item, index) => ({
                     key: index + 1,
                     icon: item.icon,
                     label: <NavLink to={item.path}>{item.content}</NavLink>,
                  }))}
               />
            </Sider>
            <Layout>
               <Header
                  className="!py-0 !px-4"
                  style={{
                     padding: 0,
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                     background: "rgb(0, 21, 41)",
                  }}
               >
                  <Tooltip title="Menu">
                     <Button
                        type="text"
                        icon={
                           collapsed ? (
                              <MenuUnfoldOutlined />
                           ) : (
                              <MenuFoldOutlined />
                           )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                           fontSize: "16px",
                           width: 64,
                           height: 64,
                           color: "#fff",
                        }}
                     />
                  </Tooltip>
                  <div>
                     <Tooltip title="Bildirish">
                        <NavLink
                           to="notifications"
                           style={{ marginRight: "10px", color: "#fff" }}
                        >
                           <NotificationOutlined />
                        </NavLink>
                     </Tooltip>
                     <Button
                        type="text"
                        style={{ fontSize: "16px", color: "#fff" }}
                     >
                        <Tooltip title="Chiqish">
                           <NavLink
                              to="/"
                              onClick={() =>
                                 localStorage.removeItem("access_token")
                              }
                           >
                              Chiqish <LogoutOutlined />
                           </NavLink>
                        </Tooltip>
                     </Button>
                  </div>
               </Header>
               <Content
                  style={{
                     margin: "24px 16px",
                     padding: 24,
                     minHeight: "calc(100vh - 64px)",
                     background: colorBgContainer,
                     borderRadius: borderRadiusLG,
                     overflow: "auto",
                  }}
               >
                  <Outlet />
               </Content>
            </Layout>
         </Layout>
      </ConfigProvider>
   );
};
export default Index;
