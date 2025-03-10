import { useState, useEffect } from "react";
import { Input, Form, Tooltip } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { UniversalTable, SkeletonWrapper } from "@components";
import { subjects } from "@service";

const Index = () => {
   const [form] = Form.useForm();
   const { search } = useLocation();
   const [total, setTotal] = useState();
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
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
         setLoading(true);
         const res = await subjects.get(params);
         if (res.status === 200) {
            setData(res?.data?.subjects);
            setTotal(res?.data?.count);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
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
         render: (_, record, index) =>
            (params.page - 1) * params.limit + index + 1,
      },
      {
         title: "Yo'nalish nomi",
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
         onCell: (record) => ({
            onClick: () => navigate(`/admin-layout/topics/${record.id}`),
            style: { cursor: "pointer" },
         }),
      },
      {
         title: "Tavsif",
         dataIndex: "description",
         key: "description",
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
   ];
   return (
      <>
         <SkeletonWrapper isLoading={loading} skeletonProps={{ rows: 6 }}>
            <div className="mb-4">
               <Form
                  form={form}
                  layout="vertical"
                  style={{
                     display: "flex",
                     gap: "16px",
                     alignItems: "flex-end",
                  }}
               >
                  <Form.Item name="name">
                     <Input
                        placeholder="Yo'nalish nomini kiriting..."
                        allowClear
                     />
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
         </SkeletonWrapper>
      </>
   );
};

export default Index;
