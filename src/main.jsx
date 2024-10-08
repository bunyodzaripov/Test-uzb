import { createRoot } from "react-dom/client";
import Router from "./routes";
import "./index.css";
import { UnreadProvider } from "./context/unread-context";

createRoot(document.getElementById("root")).render(
   <>
      <UnreadProvider>
         <Router />
      </UnreadProvider>
   </>
);
