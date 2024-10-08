import { useEffect, useState } from "react";
import { Button, Modal, Tooltip, Image } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { UniversalTable, Popconfirm, SkeletonWrapper } from "@components";
import { question, tasks } from "@service";
import { openNotification } from "@utils/notification";

const Index = () => {
   const { id } = useParams();
   const { search } = useLocation();
   const navigate = useNavigate();
   const [data, setData] = useState([]);
   const [total, setTotal] = useState();
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(true);
   const [disabled, setDisabled] = useState(false);
   const [selectedTask, setSelectedTask] = useState(null);
   const [params, setParams] = useState({
      limit: 5,
      page: 1,
      topic_id: id,
   });

   useEffect(() => {
      const params = new URLSearchParams(search);
      const page = Number(params.get("page")) || 1;
      const limit = Number(params.get("limit")) || 5;
      setParams((prev) => ({
         ...prev,
         page: page,
         limit: limit,
      }));
   }, [search]);
   useEffect(() => {
      getData();
   }, [params]);

   const getData = async () => {
      try {
         setLoading(true);
         const res = await question.get(params);
         if (res.status === 200) {
            setData(res?.data?.questions);
            setTotal(res?.data?.total);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };
   const addTask = async () => {
      try {
         const res = await tasks.create({
            topic_id: id,
            group_id: "4a227688-429e-4940-867d-3f47a91ace62",
         });
         if (res.status === 200) {
            openNotification("success", "Task qo'shildi");
            console.log(res, "res taks");
            setDisabled(true);
         }
      } catch (error) {
         openNotification("error", "Task qo'shishda xatolik");
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
   const handleTableChange = (pagination) => {
      const { current, pageSize } = pagination;
      setParams((prev) => ({
         ...prev,
         page: current,
         limit: pageSize,
      }));
      const current_params = new URLSearchParams(search);
      current_params.set("page", `${current}`);
      current_params.set("limit", `${pageSize}`);
      navigate(`?${current_params}`);
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
         render: (text, record) => (
            <Tooltip title={text}>
               <p
                  style={{
                     whiteSpace: "nowrap",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                     display: "inline-block",
                     maxWidth: "170px",
                  }}
               >
                  {text}
               </p>
            </Tooltip>
         ),
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
         <SkeletonWrapper
            isLoading={loading}
            skeletonProps={{ paragraph: { rows: 0 } }}
         >
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
            <Button
               disabled={disabled}
               type="primary"
               style={{
                  marginBottom: "20px",
                  float: "right",
                  marginRight: "10px",
               }}
               onClick={addTask}
            >
               Task qo'shish
            </Button>
         </SkeletonWrapper>
         <SkeletonWrapper isLoading={loading} skeletonProps={{ avatar: true }}>
            <UniversalTable
               columns={columns}
               dataSource={data}
               pagination={{
                  current: params.page,
                  pageSize: params.limit,
                  total: total,
                  showSizeChanger: true,
                  pageSizeOptions: [3, 5, 10, 20],
               }}
               handleChange={handleTableChange}
            />
         </SkeletonWrapper>
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
