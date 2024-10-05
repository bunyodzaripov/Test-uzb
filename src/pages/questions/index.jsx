import { useEffect, useState } from "react";
import { Button, Modal, Tooltip, Image } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { UniversalTable, Popconfirm } from "@components";
import { question } from "@service";

const Index = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [tasks, setTasks] = useState([]);
   const [open, setOpen] = useState(false);
   const [selectedTask, setSelectedTask] = useState(null);
   console.log("Questions, Topic id:", id);

   useEffect(() => {
      getData();
   }, [id]);

   const getData = async () => {
      try {
         const res = await question.get();
         if (res.status === 200) {
            setTasks(res?.data?.questions);
         }
      } catch (error) {
         console.log(error);
      }
   };
   const viewTask = (record) => {
      setSelectedTask(record);
      setOpen(true);
   };
   const deleteData = async (id) => {
      try {
         const res = await question.delete(id);
         if (res.status === 200) {
            getData();
         }
      } catch (error) {
         console.log(error);
      }
   };
   const editData = (data) => {
      navigate(`/admin-layout/questions/${id}/add-question`, { state: data });
   };
   const handleCancel = () => {
      setOpen(false);
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
         key: "name",
      },
      {
         title: "Rasm",
         dataIndex: "image",
         key: "image",
         render: (_, record) => (
            <Image
               src={record.image}
               style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "contain",
                  borderRadius: "5px",
               }}
            />
         ),
      },
      {
         title: "Harakatlar",
         dataIndex: "action",
         key: "action",
         render: (_, record) => (
            <div>
               <Tooltip title="Tahrirlash">
                  <Button
                     style={{
                        marginLeft: "10px",
                        width: "10px",
                        color: "white",
                        backgroundColor: "rgba(181,144,98,1)",
                     }}
                     onClick={() => editData(record)}
                  >
                     <EditOutlined />
                  </Button>
               </Tooltip>
               <Popconfirm
                  title="Masalani o'chirishni tasdiqlaysizmi?"
                  onConfirm={() => deleteData(record.id)}
                  okText="Ha"
                  cancelText="Yo'q"
               >
                  <Tooltip title="O'chirish">
                     <Button
                        style={{
                           marginLeft: "10px",
                           width: "10px",
                           backgroundColor: "red",
                           color: "white",
                        }}
                     >
                        <DeleteOutlined />
                     </Button>
                  </Tooltip>
               </Popconfirm>
               <Tooltip title="Tafsilotlari">
                  <Button
                     style={{
                        marginLeft: "10px",
                        width: "10px",
                        color: "white",
                        backgroundColor: "rgba(181,144,98,1)",
                     }}
                     onClick={() => viewTask(record)}
                  >
                     <EyeOutlined />
                  </Button>
               </Tooltip>
            </div>
         ),
      },
   ];
   return (
      <div style={{ padding: "20px" }}>
         <Button
            type="primary"
            style={{ marginBottom: "20px", float: "right" }}
            onClick={() =>
               navigate(`/admin-layout/questions/${id}/add-question`, {
                  state: { topic_id: id },
               })
            }
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
            open={open}
            onCancel={handleCancel}
            footer={null}
            className="task-details"
            styles={{ padding: "20px" }}
         >
            {selectedTask ? (
               <div className="task-details">
                  <p className="task-detail mb-2">
                     <strong>Masala nomi:</strong>{" "}
                     {selectedTask.name || "No task name"}
                  </p>
                  <p className="task-detail mb-2">
                     <strong>Masala sharti:</strong>{" "}
                     {selectedTask.description || "No description"}
                  </p>
                  <p className="task-detail mb-2">
                     <strong>Kiruvchi ma`lumotlar:</strong>{" "}
                     {selectedTask.input_info || "No input data"}
                  </p>
                  <p className="task-detail mb-2">
                     <strong>Chiquvchi ma`lumotlar:</strong>{" "}
                     {selectedTask.output_info || "No output data"}
                  </p>
                  <p className="task-detail mb-2">
                     <strong>Constrains:</strong>{" "}
                     {selectedTask.constrains || "No constrains data"}
                  </p>
                  <p className="task-detail mb-2">
                     <strong>Qiyinlik darajasi:</strong>{" "}
                     {selectedTask.difficulty || "No difficulty"}
                  </p>
                  <p className="task-detail mb-2">
                     <strong>Dasturlash tili:</strong>{" "}
                     {selectedTask.language || "No language data"}
                  </p>
                  <p className="task-detail mb-2">
                     <strong>Yaratilgan:</strong>{" "}
                     {selectedTask.created_at.slice(0, 10) || "No created data"}
                  </p>
               </div>
            ) : (
               <p>No task selected</p>
            )}
         </Modal>
      </div>
   );
};

export default Index;
