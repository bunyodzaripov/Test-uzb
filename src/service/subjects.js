import https from "./config";
const subjects = {
   create: (data) => https.post(`/api/subjects/create`, data),
   get: (params) => https.get(`/api/subjects/getall`, { params }),
   getOne: (id) => https.get(`/api/subjects/get/${id}`),
   delete: (id) => https.delete(`/api/subjects/delete/${id}`),
   update: (id, data) => https.put(`/api/subjects/update/${id}`, data),
};

export default subjects;
