import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "antd";
import { HomeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { UniversalTable } from "@components";
import { topic, subjects } from "@service";

const Index = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { search } = useLocation();
   const [data, setData] = useState([]);
   const [total, setTotal] = useState();
   const [subject, setSubject] = useState({});
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
   const deleteData = async (id) => {
      try {
         const res = await topic.delete(id);
         if (res.status === 200) {
            getData();
         }
      } catch (error) {
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
                     onClick={() => alert("tahrirlash")}
                  >
                     <EditOutlined />
                  </Button>
               </Tooltip>
               <Tooltip title="O'chirish">
                  <Button
                     style={{
                        marginLeft: "10px",
                        width: "10px",
                        backgroundColor: "red",
                        color: "white",
                     }}
                     onClick={() => deleteData(item.id)}
                  >
                     <DeleteOutlined />
                  </Button>
               </Tooltip>
               <Tooltip title="Ma`lumot">
                  <Button
                     style={{
                        marginLeft: "10px",
                        width: "10px",
                        color: "white",
                        backgroundColor: "rgba(181,144,98,1)",
                     }}
                     onClick={() => alert(`${item.id}`)}
                  >
                     <HomeOutlined />
                  </Button>
               </Tooltip>
            </div>
         ),
      },
   ];
   return (
      <div>
         <div className="m-4 mb-6">
            <h1 className=" text-[1.3rem] border-b-2 border-gray-300 pb-4">
               {subject?.name}
            </h1>
         </div>
         <div className="m-4 mt-11 flex justify-between">
            <h1 className="text-1xl font-semibold">Uyga vazifalar</h1>
            <Button
               type="primary"
               onClick={() =>
                  navigate("/admin-layout/add-homework", { state: { id } })
               }
            >
               Uyga vazifa qo`shish
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
