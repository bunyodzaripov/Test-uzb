import React, { useState, useEffect, useCallback } from "react";
import { List, Typography, message, Spin, Badge } from "antd";
import dayjs from "dayjs";
import { AdminLayout } from "@pages";

const { Text } = Typography;

const WS_URL = "wss://api.testuzb.uz/ws"; // WebSocket server URL

const NotificationPage = () => {
   const [notifications, setNotifications] = useState([]);
   const [socket, setSocket] = useState(null);
   const [loading, setLoading] = useState(true);

   const connectWebSocket = useCallback(() => {
      console.log("WebSocket ulanishi boshlanmoqda");
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
         console.log("WebSocket ulanishi o'rnatildi");
         const token = localStorage.getItem("access_token");
         console.log("Token yuborilmoqda:", token);
         ws.send(JSON.stringify({ action: "auth", token }));
      };

      ws.onmessage = (event) => {
         console.log("Serverdan xabar keldi:", event.data);
         try {
            const data = JSON.parse(event.data);
            console.log("Qayta ishlangan ma'lumotlar:", data);
            if (
               data.action === "updateNotifications" &&
               Array.isArray(data.notifications)
            ) {
               const sortedNotifications = data.notifications.sort(
                  (a, b) => new Date(b.date) - new Date(a.date)
               );
               setNotifications(sortedNotifications);
               setLoading(false);
            } else {
               console.error("Kutilmagan ma'lumot formati:", data);
            }
         } catch (error) {
            console.error("Xabarni qayta ishlashda xatolik:", error);
         }
      };

      ws.onerror = (error) => {
         console.error("WebSocket xatosi:", error);
         message.error("Serverga ulanishda xatolik yuz berdi");
      };

      ws.onclose = () => {
         console.log("WebSocket ulanishi yopildi");
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

   const markAsRead = useCallback(
      (id) => {
         if (socket && socket.readyState === WebSocket.OPEN) {
            console.log("markAsRead so'rovi yuborilmoqda. ID:", id);
            socket.send(JSON.stringify({ action: "markAsRead", id }));
         }
      },
      [socket]
   );

   // O'qilmagan bildirishnomalar sonini hisoblash
   const unreadCount = notifications.filter(
      (notification) => !notification.read
   ).length;

   if (loading) {
      return <Spin size="large" />;
   }

   return (
      <div style={{ padding: "20px" }}>
         <h1 style={{ marginBottom: "20px" }}>
            Xabarnomalar
            <Badge count={unreadCount} style={{ marginLeft: "10px" }} />
         </h1>
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
                     backgroundColor: item.read ? "#e8f5e9" : "#ffebee", // O'qilgan - yashil, O'qilmagan - qizil
                     cursor: "pointer",
                  }}
               >
                  <List.Item.Meta
                     title={<Text strong>{item.message}</Text>}
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
