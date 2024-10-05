import { useState, useEffect } from "react";
import { Input, Form } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { UniversalTable } from "@components";
import { subjects } from "@service";

const Index = () => {
   const [form] = Form.useForm();
   const { search } = useLocation();
   const [total, setTotal] = useState();
   const [data, setData] = useState([]);
   const [params, setParams] = useState({
      limit: 5,
      page: 1,
   });
   const navigate = useNavigate();

   useEffect(() => {
      getData();
   }, [params]);
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

   const getData = async () => {
      try {
         const res = await subjects.get(params);
         if (res.status === 200) {
            setData(res?.data?.subjects);
            setTotal(res?.data?.count);
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
         title: "Yo'nalish nomi",
         dataIndex: "name",
         key: "name",
         render: (text, record) => (
            <a onClick={() => navigate(`/admin-layout/group/${record.id}`)}>
               {text}
            </a>
         ),
      },
      {
         title: "Tavsif",
         dataIndex: "description",
         key: "description",
      },
   ];
   return (
      <div>
         <div className="mb-4">
            <Form
               form={form}
               layout="vertical"
               style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}
            >
               <Form.Item name="name" label="Guruh nomi">
                  <Input placeholder="Guruh nomini kiriting..." allowClear />
               </Form.Item>
            </Form>
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
