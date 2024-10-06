// file: src/components/NotificationPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { List, Button, Typography, Row, Col, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

// const WS_URL = "ws://api.testuzb.uz//ws";

const NotificationPage = () => {
   const [notifications, setNotifications] = useState([]);
   const [socket, setSocket] = useState(null);

   const connectWebSocket = useCallback(() => {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
         console.log("WebSocket ulanish o'rnatildi");
         const token = localStorage.getItem("access_token");
         ws.send(JSON.stringify({ type: "auth", token: token }));
      };

      ws.onmessage = (event) => {
         try {
            const data = JSON.parse(event.data);
            if (data.type === "notifications") {
               setNotifications(data.payload);
            } else if (data.type === "error") {
               message.error(data.payload);
            }
         } catch (error) {
            console.error("Xabarni qayta ishlashda xatolik:", error);
         }
      };

      ws.onerror = (error) => {
         console.error("WebSocket xatosi:", error);
         message.error("Serverga ulanishda xatolik yuz berdi");
      };

      ws.onclose = (event) => {
         console.log(
            "WebSocket ulanishi yopildi. Kod:",
            event.code,
            "Sabab:",
            event.reason
         );
         message.warning(
            "Server bilan aloqa uzildi. Qayta ulanishga urinilmoqda..."
         );
         setTimeout(connectWebSocket, 5000);
      };

      setSocket(ws);
   }, []);

   useEffect(() => {
      connectWebSocket();

      return () => {
         if (socket) {
            socket.close();
         }
      };
   }, [connectWebSocket]);

   const markAllAsRead = useCallback(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
         socket.send(JSON.stringify({ type: "markAllAsRead" }));
      }
   }, [socket]);

   const markAsRead = useCallback(
      (id) => {
         if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "markAsRead", id: id }));
         }
      },
      [socket]
   );

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
                           {dayjs(item.date).format("MMMM D, YYYY h:mm A")}
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
