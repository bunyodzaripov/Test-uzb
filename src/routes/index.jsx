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
   MyGroups,
   Profile,
   GroupDetails,
   AddHomework,
   Subjects,
   AddTask,
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
               <Route index element={<MyGroups />} />
               <Route path="group/:id" element={<GroupDetails />} />
               <Route path="subjects/:id" element={<Subjects />} />
               <Route path="subjects/:id/add-task" element={<AddTask />} />
               <Route path="add-homework" element={<AddHomework />} />
               <Route path="profile" element={<Profile />} />
               <Route path="notifications" element={<Notifications />} />
            </Route>
         </Route>
      )
   );

   return <RouterProvider router={router} />;
};

export default Index;
