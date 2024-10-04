import https from "./config";
const topic = {
   create: (data) => https.post(`/api/topics/create`, data),
   get: (params) => https.get(`/api/topics/getAll`, { params }),
   delete: (id) => https.delete(`/api/topics/delete/${id}`),
   update: (id, data) => https.put(`/api/topics/update/${id}`, data),
};

export default topic;
