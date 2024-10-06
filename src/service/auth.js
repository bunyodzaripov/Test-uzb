import https from "./config";
const auth = {
   sign_in: (data) => https.post("/all/user/login", data),
   refresh: (data) => https.post("/all/user/refresh", data),
};

export default auth;
