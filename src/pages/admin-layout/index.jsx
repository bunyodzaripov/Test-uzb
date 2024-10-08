import { useContext, useState } from "react";
import {
   Button,
   Layout,
   Menu,
   theme,
   ConfigProvider,
   Tooltip,
   Badge,
} from "antd";
import {
   MenuFoldOutlined,
   MenuUnfoldOutlined,
   BellOutlined,
   LogoutOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { admin } from "../../routes/routes";
import logo from "../../assets/images/logo.png";
import { Popconfirm } from "@components";
import { UnreadContext } from "../../context/unread-context";
const { Header, Sider, Content } = Layout;

const Index = () => {
   const [collapsed, setCollapsed] = useState(false);
   const { unreadCount } = useContext(UnreadContext);
   const {
      token: { colorBgContainer, borderRadiusLG },
   } = theme.useToken();
   const { pathname } = useLocation();
   const navigate = useNavigate();

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
                  defaultSelectedKeys={[pathname]}
               >
                  {admin.map((item) => (
                     <Menu.Item key={item.path} icon={item.icon}>
                        <NavLink to={item.path}>{item.content}</NavLink>
                     </Menu.Item>
                  ))}
               </Menu>
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
                           style={{
                              marginRight: "30px",
                              color: "#fff",
                           }}
                        >
                           <Badge count={unreadCount} overflowCount={99}>
                              <BellOutlined
                                 style={{
                                    fontSize: "24px",
                                    color: "#fff",
                                    verticalAlign: "middle",
                                 }}
                              />
                           </Badge>
                        </NavLink>
                     </Tooltip>
                     <Popconfirm
                        title="Chiqish"
                        description="Siz rostan chiqmoqchimisiz?"
                        okText="Ha"
                        cancelText="Yo'q"
                        onConfirm={() => {
                           localStorage.removeItem("access_token");
                           navigate("/sign-in");
                        }}
                        placement="leftBottom"
                     >
                        <Tooltip title="Chiqish">
                           <Button
                              style={{
                                 background: "rgb(0, 21, 41)",
                                 color: "#fff",
                              }}
                           >
                              Chiqish <LogoutOutlined />
                           </Button>
                        </Tooltip>
                     </Popconfirm>
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
