import { notification } from "antd";

export const openNotification = (type, message, description) => {
   notification[type]({
      message: message,
      description: description,
      placement: "topRight",
      duration: 2,
      showProgress: true,
   });
};
