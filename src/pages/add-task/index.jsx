import { useState } from "react";
import { Form, Input, Button, Select, Upload, Space } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { UniversalTable } from "@components";
const { TextArea } = Input;
const { Option } = Select;

const CreateTask = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [form] = Form.useForm();
   const [testCases, setTestCases] = useState([]);

   const handleAddTestCase = () => {
      setTestCases([
         ...testCases,
         { key: testCases.length, input: "", output: "" },
      ]);
   };
   const handleRemoveTestCase = (key) => {
      setTestCases(testCases.filter((testCase) => testCase.key !== key));
   };
   const handleInputChange = (value, key, field) => {
      const updatedTestCases = testCases.map((testCase) =>
         testCase.key === key ? { ...testCase, [field]: value } : testCase
      );
      setTestCases(updatedTestCases);
   };
   const columns = [
      {
         title: "Input",
         dataIndex: "input",
         key: "input",
         render: (_, record) => (
            <Input
               value={record.input}
               onChange={(e) =>
                  handleInputChange(e.target.value, record.key, "input")
               }
            />
         ),
      },
      {
         title: "Output",
         dataIndex: "output",
         key: "output",
         render: (_, record) => (
            <Input
               value={record.output}
               onChange={(e) =>
                  handleInputChange(e.target.value, record.key, "output")
               }
            />
         ),
      },
      {
         title: "Actions",
         key: "actions",
         align: "center",
         render: (_, record) => (
            <Button
               icon={<DeleteOutlined />}
               onClick={() => handleRemoveTestCase(record.key)}
               danger
            />
         ),
      },
   ];
   const handleSubmit = async (values) => {
      // console.log(values);
      try {
      } catch (error) {
         console.log(error);
      }
      // alert("Masala qo'shildi!");
      // navigate(`/admin-layout/subjects/${id}`);
   };
   console.log(id);

   return (
      <div style={{ padding: "20px" }}>
         <h2>Masala qo'shish ID: {id}</h2>
         <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
               label="Masala nomi"
               name="name"
               rules={[
                  { required: true, message: "Iltimos masala nomini kiriting" },
               ]}
            >
               <Input />
            </Form.Item>
            <Form.Item
               label="Masala sharti"
               name="description"
               rules={[
                  {
                     required: true,
                     message: "Iltimos masala shartini kiriting",
                  },
               ]}
            >
               <TextArea rows={4} />
            </Form.Item>
            <Form.Item
               label="Kiruvchi ma`lumotlar"
               name="input_info"
               rules={[
                  {
                     required: true,
                     message: "Iltimos kiruvchi ma`lumotlarni kiriting",
                  },
               ]}
            >
               <TextArea rows={4} />
            </Form.Item>
            <Form.Item
               label="Chiquvchi ma`lumotlar"
               name="output_info"
               rules={[
                  {
                     required: true,
                     message: "Iltimos chiquvchi ma`lumotlarni kiriting",
                  },
               ]}
            >
               <TextArea rows={4} />
            </Form.Item>
            <Form.Item
               label="constrains"
               name="constrains"
               rules={[
                  {
                     required: true,
                     message: "Iltimos constrainsni kiriting",
                  },
               ]}
            >
               <Input className="p-2" />
            </Form.Item>
            <Form.Item
               label="Qiyinlik darajasi"
               name="difficulty"
               rules={[
                  {
                     required: true,
                     message: "Iltimos qiyinlik darajasini tanlang",
                  },
               ]}
            >
               <Select placeholder="Select difficulty level">
                  <Option value="easy">Easy</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="hard">Hard</Option>
               </Select>
            </Form.Item>
            <Form.Item
               label="Dasturlash tili"
               name="language"
               rules={[
                  {
                     required: true,
                     message: "Iltimos dasturlash tilini tanlang",
                  },
               ]}
            >
               <Select placeholder="Select language">
                  <Option value="JS">JavaScript</Option>
                  <Option value="JAVA">Java</Option>
                  <Option value="PY">Python</Option>
               </Select>
            </Form.Item>
            <Form.Item label="Rasm yuklash(ixtiyoriy)" name="image">
               <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
               </Upload>
            </Form.Item>
            <h3 className="mb-4">Namunaviy testlar</h3>
            <UniversalTable
               columns={columns}
               dataSource={testCases}
               pagination={{ pageSize: 3 }}
            />
            <Space
               direction="vertical"
               style={{ width: "100%", overflow: "auto" }}
            >
               <Button
                  type="dashed"
                  className="w-full"
                  onClick={handleAddTestCase}
               >
                  Input va Output qo'shish
               </Button>
            </Space>
            <Form.Item style={{ marginTop: "20px" }}>
               <Button type="primary" htmlType="submit">
                  Masala qo'shish
               </Button>
            </Form.Item>
         </Form>
      </div>
   );
};

export default CreateTask;
