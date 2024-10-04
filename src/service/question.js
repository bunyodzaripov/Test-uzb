import https from "./config";
const question = {
   create: (data) => https.post(`/api/questions/create`, data),
   get: (params) => https.get(`/api/questions/getAll`, { params }),
   delete: (id) => https.delete(`/api/questions/delete/${id}`),
   update: (id, data) => https.put(`/api/questions/update/${id}`, data),
};

export default question;
