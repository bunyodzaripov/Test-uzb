import React from "react";
import { Form, Input, Button } from "antd";
import { topic } from "@service";
import { useLocation } from "react-router";
import { openNotification } from "@utils/notification";
const HomeworkForm = () => {
   const [form] = Form.useForm();
   const location = useLocation();
   const { id } = location.state || {};

   const handleSubmit = async (values) => {
      try {
         const res = await topic.create({ ...values, subject_id: id });
         if (res.status === 200) {
            form.resetFields();
            openNotification("success", "Mavzu qo'shildi");
         }
      } catch (error) {
         openNotification("error", "Mavzu qo'shishda xatolik");
         console.log(error);
      }
   };

   return (
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
         <Form.Item
            label="Mavzu nomi"
            name="name"
            rules={[{ required: true, message: "Mavzu nomini kiriting" }]}
         >
            <Input />
         </Form.Item>

         <Form.Item
            label="Mavzu tavsifi"
            name="description"
            rules={[{ required: true, message: "Mavzu tavsifini kiriting" }]}
         >
            <Input.TextArea rows={4} />
         </Form.Item>

         <Button type="primary" htmlType="submit">
            Qo'shish
         </Button>
      </Form>
   );
};

export default HomeworkForm;
