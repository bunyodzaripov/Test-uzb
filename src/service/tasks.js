import https from "./config";
const tasks = {
   create: (data) => https.post(`/api/task/create`, data),
   get: (params) => https.get(`/api/task/getall`, { params }),
   delete: (id) => https.delete(`/api/task/delete/${id}`),
};

export default tasks;
