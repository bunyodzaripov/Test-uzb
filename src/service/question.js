import https from "./config";
const question = {
   create: (data) => https.post("/api/questions/create", data),
   addImg: (id, data) => https.post(`/api/questions/upload-image/${id}`, data),
   get: (params) => https.get(`/api/questions/getAll`, { params }),
   delete: (id) => https.delete(`/api/questions/delete/${id}`),
   update: (id, data) => https.put(`/api/questions/update/${id}`, data),
};

export default question;
