import { useState, useEffect } from "react";
import { Form, Input, Button, Select, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UniversalTable } from "@components";
import { question } from "@service";
import { openNotification } from "@utils/notification";
const { TextArea } = Input;
const { Option } = Select;

const Index = () => {
   const { id } = useParams();
   const location = useLocation();
   const { state } = location;
   const navigate = useNavigate();
   const [form] = Form.useForm();
   const [testCases, setTestCases] = useState([]);
   const [img, setImg] = useState([]);
   const [file, setFile] = useState([]);

   useEffect(() => {
      if (state.id) {
         form.setFieldsValue({
            name: state.name,
            description: state.description,
            test_cases: state.test_cases,
            difficulty: state.difficulty,
            input_info: state.input_info,
            output_info: state.output_info,
            language: state.language,
            constrains: state.constrains,
         });
         setImg(state?.image);
      } else {
         form.resetFields();
      }
   }, [state, form]);
   useEffect(() => {
      getTestCases();
   }, [state]);

   // test cases
   const handleAddTestCase = () => {
      setTestCases([...testCases, { input: "", output: "" }]);
   };
   const getTestCases = async () => {
      try {
         const res = await question.getTestCases(state.id);
         if (res.status === 200) {
            const formattedTestCases = res.data.inputs_with_outputs;
            formattedTestCases.forEach((testCase) => {
               testCase.input = testCase.input.input;
               testCase.output = testCase.output.answer;

               setTestCases((prevTestCases) => [...prevTestCases, testCase]);
            });
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleRemoveTestCase = (index) => {
      console.log(index, "index");
      setTestCases(testCases.filter((_, i) => i !== index));
   };
   const handleInputChange = (value, index, field) => {
      const updatedTestCases = testCases.map((testCase, i) =>
         i === index ? { ...testCase, [field]: value } : testCase
      );
      setTestCases(updatedTestCases);
   };
   // file
   const handleChange = (e) => {
      let fileData = e.target.files[0];
      setFile(fileData);
   };
   // submit
   const handleSubmit = async (values) => {
      if (state.id) {
         try {
            const res = await question.update(state.id, {
               ...values,
               image: img,
               topic_id: id,
            });
            if (res.status === 200) {
               openNotification("success", "Masala yangilandi");
               navigate(`/admin-layout/questions/${id}`);
            } else {
               openNotification("error", "Masala yangilashda xatolik");
            }
         } catch (error) {
            console.log("Error:", error);
            openNotification("error", "Noma'lum xato yuz berdi");
         }
      } else {
         try {
            const res = await question.create({
               ...values,
               topic_id: id,
               inputs_outputs: testCases,
            });

            if (res.status === 200) {
               if (file) {
                  const formData = new FormData();
                  formData.append("file", file);

                  try {
                     await question.addImg(res?.data?.id, formData);
                     openNotification("success", "Masala va rasm qo'shildi");
                     navigate(`/admin-layout/questions/${id}`);
                  } catch (uploadError) {
                     navigate(`/admin-layout/questions/${id}`);
                  }
               } else {
                  openNotification("success", "Masala qo'shildi");
                  navigate(`/admin-layout/questions/${id}`);
               }
            } else {
               openNotification("error", "Masala qo'shishda xatolik");
            }
            console.log("Res submit form:", res);
         } catch (error) {
            console.log("Error:", error);
            openNotification("error", "Noma'lum xato yuz berdi");
         }
      }
   };

   // table
   const columns = [
      {
         title: "Input",
         dataIndex: "input",
         key: "input",
         render: (_, record, index) => (
            <Input
               value={record.input}
               onChange={(e) =>
                  handleInputChange(e.target.value, index, "input")
               }
            />
         ),
      },
      {
         title: "Output",
         dataIndex: "output",
         key: "output",
         render: (_, record, index) => (
            <Input
               value={record.output}
               onChange={(e) =>
                  handleInputChange(e.target.value, index, "output")
               }
            />
         ),
      },
      {
         title: "Actions",
         key: "actions",
         align: "center",
         render: (_, record, index) => (
            <Button
               icon={<DeleteOutlined />}
               onClick={() => handleRemoveTestCase(index)}
               danger
            />
         ),
      },
   ];

   return (
      <div style={{ padding: "20px" }}>
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
               label="Constrains"
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
            {!state.id && (
               <Form.Item label="Rasm yuklash" name="image">
                  <Input type="file" onChange={handleChange} />
               </Form.Item>
            )}
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
                  {state.id ? "Yangilash" : "Qo'shish"}
               </Button>
            </Form.Item>
         </Form>
      </div>
   );
};

export default Index;
