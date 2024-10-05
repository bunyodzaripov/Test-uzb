import React, { useEffect } from "react";
import { Button, Modal, Input, Form } from "antd";
import { openNotification } from "@utils/notification";
import { topic } from "@service";

const Index = (props) => {
   const [form] = Form.useForm();
   const { open, handleClose, update, getData, id } = props;

   useEffect(() => {
      if (update.id) {
         form.setFieldsValue({
            name: update.name,
            description: update.description,
         });
      } else {
         form.resetFields();
      }
   }, [update, form]);

   const handleSubmit = async (values) => {
      if (update.id) {
         try {
            const res = await topic.update({
               ...values,
               id: update.id,
               subject_id: update.subject_id,
            });
            if (res.status === 200) {
               handleClose();
               getData();
               openNotification("success", "Mavzu yangilandi");
            }
         } catch (error) {
            openNotification("error", "Mavzu yangilashda xatolik");
            console.log(error);
         }
      } else {
         try {
            const res = await topic.create({ ...values, subject_id: id });
            if (res.status === 200) {
               handleClose();
               getData();
               openNotification("success", "Mavzu qo'shildi");
            }
         } catch (error) {
            openNotification("error", "Mavzu qo'shishda xatolik");
            console.log(error);
         }
      }
   };

   return (
      <>
         <Modal
            open={open}
            title={update.id ? "Mavzuni yangilash" : "Mavzu qo'shish"}
            onCancel={handleClose}
            width={500}
            footer={
               <div
                  style={{
                     display: "flex",
                     justifyContent: "flex-start",
                     gap: "10px",
                  }}
               >
                  <Button type="primary" form="basic" htmlType="submit">
                     {update.id ? "Yangilash" : "Qo'shish"}
                  </Button>
                  <Button onClick={handleClose}>Bekor</Button>
               </div>
            }
         >
            <Form form={form} id="basic" name="basic" onFinish={handleSubmit}>
               <Form.Item
                  label="Mavzu nomi"
                  name="name"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[{ required: true, message: "Mavzu nomini kiriting" }]}
               >
                  <Input />
               </Form.Item>

               <Form.Item
                  label="Mavzu tavsifi"
                  name="description"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                     { required: true, message: "Mavzu tavsifini kiriting" },
                  ]}
               >
                  <Input.TextArea rows={4} />
               </Form.Item>
            </Form>
         </Modal>
      </>
   );
};
export default Index;
