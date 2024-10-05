import { useState, useEffect } from "react";
import { Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { UniversalTable, Popconfirm } from "@components";
import { topic, subjects } from "@service";
import { Topics } from "@modals";
import { openNotification } from "@utils/notification";

const Index = () => {
   const { id } = useParams();
   const { search } = useLocation();
   const navigate = useNavigate();
   const [data, setData] = useState([]);
   const [total, setTotal] = useState();
   const [subject, setSubject] = useState({});
   const [open, setOpen] = useState(false);
   const [update, setUpdate] = useState({});
   const [params, setParams] = useState({
      limit: 5,
      page: 1,
      subject_id: id,
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
      getSubject();
   }, [params]);

   const openModal = () => {
      setOpen(true);
   };
   const handleClose = () => {
      setOpen(false);
      setUpdate({});
   };
   const getData = async () => {
      try {
         const res = await topic.get(params);
         if (res.status === 200) {
            setData(res?.data?.topics);
            setTotal(res?.data?.count);
         }
      } catch (error) {
         console.log(error);
      }
   };
   const getSubject = async () => {
      try {
         const res = await subjects.getOne(id);
         if (res.status === 200) {
            setSubject(res?.data);
         }
      } catch (error) {
         console.log(error);
      }
   };
   const editData = (data) => {
      setUpdate(data);
      openModal();
   };
   const deleteData = async (id) => {
      try {
         const res = await topic.delete(id);
         if (res.status === 200) {
            getData();
            openNotification("success", "Mavzu o'chirildi");
         }
      } catch (error) {
         openNotification("error", "Mavzu o'chirishda xatolik");
         console.log(error);
      }
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
         title: "Mavzu",
         dataIndex: "name",
         key: "name",
         render: (text, record) => (
            <Tooltip title={text}>
               <a
                  onClick={() =>
                     navigate(`/admin-layout/subjects/${record.id}`)
                  }
                  style={{
                     whiteSpace: "nowrap",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                     display: "inline-block",
                     maxWidth: "170px",
                  }}
               >
                  {text}
               </a>
            </Tooltip>
         ),
      },
      {
         title: "Tavsif",
         dataIndex: "description",
         key: "description",
      },
      {
         title: "Boshlangan sanasi",
         dataIndex: "created_at",
         key: "created_at",
         render: (text) => new Date(text).toLocaleDateString(),
      },
      {
         title: "Harakatlar",
         key: "action",
         render: (item) => (
            <div>
               <Tooltip title="Tahrirlash">
                  <Button
                     style={{
                        marginLeft: "10px",
                        width: "10px",
                        color: "white",
                        backgroundColor: "rgba(181,144,98,1)",
                     }}
                     onClick={() => editData(item)}
                  >
                     <EditOutlined />
                  </Button>
               </Tooltip>
               <Popconfirm
                  title="Mavzu o'chirishni tasdiqlaysizmi?"
                  onConfirm={() => deleteData(item.id)}
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
            </div>
         ),
      },
   ];
   return (
      <div>
         <Topics
            open={open}
            handleClose={handleClose}
            update={update}
            getData={getData}
            id={id}
         />
         <div className="m-4 mb-6">
            <h1 className=" text-[1.3rem] border-b-2 border-gray-300 pb-4">
               {subject?.name}
            </h1>
         </div>
         <div className="m-4 mt-11 flex justify-between">
            <h1 className="text-1xl font-semibold"></h1>
            <Button type="primary" onClick={openModal}>
               Mavzu qo'shish
            </Button>
         </div>
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
      </div>
   );
};

export default Index;
