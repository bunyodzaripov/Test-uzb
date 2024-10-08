import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { auth } from "@service";
import { openNotification } from "@utils/notification";

const Index = () => {
   const navigate = useNavigate();

   const handleSubmit = async (values) => {
      try {
         const res = await auth.sign_in(values);
         if (res.status === 200) {
            console.log(res, "sign in res");

            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
            navigate("/admin-layout");
            openNotification("success", "Tizimga kirdingiz");
         }
      } catch (error) {
         if (error.response) {
            if (error.response.status === 401) {
               openNotification("error", "Login yoki parol noto'g'ri");
            } else {
               openNotification("error", "Noma'lum xato yuz berdi");
            }
         } else {
            console.log(error);
         }
      }
   };

   return (
      <div className="flex justify-center items-center h-[100vh]">
         <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl font-semibold mb-4">Admin paneli</h1>
            <Form name="basic" onFinish={handleSubmit}>
               <Form.Item
                  name="hh_id"
                  rules={[
                     {
                        required: true,
                        message: "Please input your phone number!",
                     },
                  ]}
               >
                  <Input
                     prefix={<UserOutlined />}
                     placeholder="Enter your username"
                     className="w-[300px] py-2"
                  />
               </Form.Item>
               <Form.Item
                  name="password"
                  rules={[
                     {
                        required: true,
                        message: "Please input your password!",
                     },
                     {
                        min: 5,
                        message: "Password must be at least 6 characters",
                     },
                  ]}
               >
                  <Input.Password
                     prefix={<LockOutlined />}
                     placeholder="Enter your password"
                     className="w-[300px] py-2"
                  />
               </Form.Item>
               <Form.Item
                  wrapperCol={{
                     span: 24,
                  }}
               >
                  <Button
                     type="primary"
                     htmlType="submit"
                     className="w-full mt-4"
                     size="large"
                     style={{
                        backgroundColor: "#c2410c",
                     }}
                  >
                     Kirish
                  </Button>
               </Form.Item>
            </Form>
         </div>
      </div>
   );
};
export default Index;
