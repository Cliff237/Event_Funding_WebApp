import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/ui/public/Home";
import About from "../pages/ui/public/About";
import DashboardLayout from "../pages/components/public/dashboardLayout";
import SignUp from "../pages/components/public/SignUp";
import LogIn from "../pages/components/public/LogIn";
import Unauthorized from "../pages/components/public/Unauthorized";
import AdminDashbboardLayout from "../pages/components/Organizer/adminDashbboardLayout";
import CustomEvent from "../pages/ui/Organizer/CustomEvent";
import TransactionsPage from "../pages/ui/Organizer/Transactionspage";
import OverviewPage from "../pages/ui/Organizer/Overview";
import CreateEvents from "../pages/ui/Organizer/CreateEvents";
// Use the My Events page implementation
import SuperAdminOverview from "../pages/ui/Admin/AdminOverview";
import SuperAdminUsers from "../pages/ui/Admin/AdminUsers";
import SuperAdminSchools from "../pages/ui/Admin/AdminSchools";
import MyOrganizers from "../pages/ui/SchoolAdmin/MyOrganizer";
import NotificationPage from "../pages/ui/Organizer/Notification";
import ProtectedRoute from "./PotectedRoute";
import MyEvent from "../pages/ui/Organizer/MyEvent";
import ContributorView from "../pages/ui/ContributorView";

// const router = createBrowserRouter([
//     {   element:<DashboardLayout/>,
//         children:[
//         {
//             path:'/',
//             element:<Home/>
//         },
//         {
//             path:'/aboutUs',
//             element:<About/>
//         }
//         ]
//     },
//     {
//         element:<AdminDashbboardLayout/>,
//         children:[
//             {
//                 path:'/overview',
//                 element:<OverviewPage/>
//             },
//             {
//                 path:'/createEvent',
//                 element:<CreateEvents/>
//             },
//             {
//                 path:'/myEvent',
//                 element:<MyEvent/>
//             },
//             {
//                 path:'/notification',
//                 element:<NotificationPage/>
//             },
//             {
//                 path:'/transaction',
//                 element:<TransactionsPage/>
//             },{
//                 path:'/superAdmin/overview',
//                 element:<SuperAdminOverview/>
//             },{
//                 path:'/superAdmin/users',
//                 element:<SuperAdminUsers/>
//             },{
//                 path:'/schoolAdmin/organizer',
//                 element:<MyOrganizers/>
//             },{
//                 path:'/superAdmin/schools',
//                 element:<SuperAdminSchools/>
//             }


//         ]
//     },
//     {
//         element:<SignUp/>,
//         path:'/SignUp'
//     },
//     {
//         element:<LogIn/>,
//         path:'/logIn'
//     },
//     {
//         element:<CustomEvent/>,
//         path:'/CustomEvent'
//     },

// ])


const router = createBrowserRouter([
  {   
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/aboutUs", element: <About /> },
    ],
  },

  {
    element: <AdminDashbboardLayout />,
    children: [
      {
        path: "/overview",
        element: (
          <ProtectedRoute allowedRoles={["ORGANIZER","SCHOOL_ADMIN","SCHOOL_ORGANIZER"]}>
            <OverviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/createEvent",
        element: (
          <ProtectedRoute allowedRoles={["ORGANIZER","SUPER_ADMIN","SCHOOL_ADMIN","SCHOOL_ORGANIZER"]}>
            <CreateEvents />
          </ProtectedRoute>
        ),
      },
      {
        path: "/myEvent",
        element: (
          <ProtectedRoute allowedRoles={["ORGANIZER","SUPER_ADMIN","SCHOOL_ADMIN","SCHOOL_ORGANIZER"]}>
            <MyEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notification",
        element: (
          <ProtectedRoute allowedRoles={["ORGANIZER","SUPER_ADMIN","SCHOOL_ADMIN","SCHOOL_ORGANIZER"]}>
            <NotificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/transaction",
        element: (
          <ProtectedRoute allowedRoles={["ORGANIZER","SUPER_ADMIN","SCHOOL_ADMIN","SCHOOL_ORGANIZER"]}>
            <TransactionsPage />
          </ProtectedRoute>
        ),
      },

      // 🔑 Super Admin routes
      {
        path: "/superAdmin/overview",
        element: (
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "/superAdmin/users",
        element: (
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/superAdmin/schools",
        element: (
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminSchools />
          </ProtectedRoute>
        ),
      },

      // 🔑 School Admin routes
      {
        path: "/schoolAdmin/organizer",
        element: (
          <ProtectedRoute allowedRoles={["SCHOOL_ADMIN"]}>
            <MyOrganizers />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Public pages
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  // Event contribution page with eventType and eventSlug
  { path: "/customEvent", element: <CustomEvent /> },
  { path: "/event/:eventType/:eventSlug", element: <ContributorView /> },
]);
export default router