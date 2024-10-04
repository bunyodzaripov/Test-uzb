import https from "./config";
const auth = {
   sign_in: (data) => https.post("/all/user/login", data),
};

export default auth;
