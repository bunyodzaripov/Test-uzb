import {
   createBrowserRouter,
   createRoutesFromElements,
   Route,
   RouterProvider,
} from "react-router-dom";
import App from "../App";
import {
   SignIn,
   AdminLayout,
   Subjects,
   Profile,
   Topics,
   Questions,
   AddQuestion,
} from "@pages";
import { Notifications, ProtectedRoute } from "@components";
const Index = () => {
   const router = createBrowserRouter(
      createRoutesFromElements(
         <Route path="/" element={<App />}>
            <Route index element={<SignIn />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route
               path="admin-layout"
               element={
                  <ProtectedRoute>
                     <AdminLayout />
                  </ProtectedRoute>
               }
            >
               <Route index element={<Subjects />} />
               <Route path="topics/:id" element={<Topics />} />
               <Route path="questions/:id" element={<Questions />} />
               <Route
                  path="questions/:id/add-question"
                  element={<AddQuestion />}
               />
               <Route path="profile" element={<Profile />} />
               <Route path="notifications" element={<Notifications />} />
            </Route>
         </Route>
      )
   );

   return <RouterProvider router={router} />;
};

export default Index;
