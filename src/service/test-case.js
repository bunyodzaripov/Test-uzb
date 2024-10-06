import https from "./config";
const testCase = {
   create: (data) => https.post("/api/test-cases/create", data),
   get: (id) => https.get(`/api/test-cases/question/${id}`),
   delete: (id) => https.delete(`/api/test-cases/delete/${id}`),
};

export { testCase };
