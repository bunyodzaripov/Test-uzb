import axios from "axios";

const https = axios.create({
   baseURL: "https://api.testuzb.uz",
});

https.interceptors.request.use((config) => {
   const access_token = localStorage.getItem("access_token");
   if (access_token) {
      config.headers["Authorization"] = `${access_token}`;
   }
   return config;
});

export default https;
