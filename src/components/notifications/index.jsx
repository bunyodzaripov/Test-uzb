import { useState } from "react";
import { List, Button, Typography, Row, Col } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const NotificationPage = () => {
   const [notifications, setNotifications] = useState([
      { id: 1, message: "New user registered", date: new Date(), read: false },
      {
         id: 2,
         message: "Server update scheduled",
         date: new Date(),
         read: true,
      },
   ]);

   const markAllAsRead = () => {
      const updatedNotifications = notifications.map((notification) => ({
         ...notification,
         read: true,
      }));
      setNotifications(updatedNotifications);
   };

   const markAsRead = (id) => {
      const updatedNotifications = notifications.map((notification) =>
         notification.id === id ? { ...notification, read: true } : notification
      );
      setNotifications(updatedNotifications);
   };

   return (
      <div style={{ padding: "20px" }}>
         <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: "20px" }}
         >
            <Col>
               <h1 className="text-2xl semibold">Xabarnomalar</h1>
            </Col>
            <Col>
               <Button
                  onClick={markAllAsRead}
                  icon={<CheckCircleOutlined style={{ fontSize: "18px" }} />}
                  type="primary"
                  shape="circle"
               />
            </Col>
         </Row>

         <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
               <List.Item
                  onClick={() => markAsRead(item.id)}
                  style={{
                     padding: "15px",
                     marginBottom: "10px",
                     borderRadius: "8px",
                     backgroundColor: item.read ? "#fff" : "#f0f0f0",
                     cursor: "pointer",
                  }}
               >
                  <List.Item.Meta
                     title={
                        <Row justify="space-between">
                           <Text strong>{item.message}</Text>
                        </Row>
                     }
                     description={
                        <Text style={{ color: "#888", fontSize: "12px" }}>
                           {dayjs(item.date).format("MMMM D, YYYY h:mm A")}{" "}
                        </Text>
                     }
                  />
               </List.Item>
            )}
         />
      </div>
   );
};

export default NotificationPage;
