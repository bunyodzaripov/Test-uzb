import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { UniversalTable } from "@components";
import { question } from "@service";
const HomeworkDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [tasks, setTasks] = useState([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [selectedTask, setSelectedTask] = useState(null);

   useEffect(() => {
      getData();
   }, []);

   const getData = async () => {
      try {
         const res = await question.get();
         if (res.status === 200) {
            setTasks(res?.data?.questions);
            console.log(res?.data?.questions);
         }
      } catch (error) {
         console.log(error);
      }
   };
   const viewTask = (record) => {
      setSelectedTask(record);
      setIsModalVisible(true);
   };
   const handleCancel = () => {
      setIsModalVisible(false);
   };

   const columns = [
      {
         title: "No",
         dataIndex: "no",
         key: "no",
         render: (_, record, index) => index + 1,
      },
      {
         title: "Masala nomi",
         dataIndex: "name",
         key: "taskName",
      },
      {
         title: "Harakat",
         dataIndex: "action",
         key: "action",
         render: (_, record) => (
            <Button type="primary" onClick={() => viewTask(record)}>
               <EyeOutlined />
            </Button>
         ),
      },
   ];
   return (
      <div style={{ padding: "20px" }}>
         <h2>Uyga vazifa ID: {id}</h2>
         <Button
            type="primary"
            onClick={() => navigate(`/admin-layout/subjects/${id}/add-task`)}
         >
            Masala qo'shish
         </Button>
         <UniversalTable
            columns={columns}
            dataSource={tasks}
            style={{ marginTop: "20px" }}
         />

         <Modal
            title="Masala Tafsilotlari"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
         >
            {/* {selectedTask && (
               <div className="p-4">
                  <p className="mb-2">
                     <strong>Task Name:</strong>{" "}
                     {tasks || "No taskName"}
                  </p>
                  <p className="mb-2">
                     <strong>Description:</strong>{" "}
                     {localStorageTasks?.description || "No description"}
                  </p>
                  <p className="mb-2">
                     <strong>Difficulty:</strong>{" "}
                     {localStorageTasks?.difficulty || "No difficulty"}
                  </p>
                  <p className="mb-2">
                     <strong>inputData:</strong>{" "}
                     {localStorageTasks?.inputData || "No inputData"}
                  </p>
                  <p className="mb-2">
                     <strong>outputData:</strong>{" "}
                     {localStorageTasks?.outputData || "No outputData"}
                  </p>
                  <p className="mb-2">
                     <strong>TestCase:</strong>{" "}
                     {localStorageTasks?.testCases.length || "No TestCase"}
                  </p>
               </div>
            )} */}
         </Modal>
      </div>
   );
};

export default HomeworkDetail;
