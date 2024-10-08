import https from "./config";
const tasks = {
   create: (data) => https.post(`/api/task/create`, data),
   get: (data) => https.get(`/api/task/get`, data),
   delete: (id) => https.delete(`/api/task/delete/${id}`),
};

export default tasks;
