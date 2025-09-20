import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/ui/public/Home";
import About from "../pages/ui/public/About";
import DashboardLayout from "../pages/components/public/dashboardLayout";
import SignUp from "../pages/components/public/SignUp";
import LogIn from "../pages/components/public/LogIn";
import AdminDashbboardLayout from "../pages/components/Organizer/adminDashbboardLayout";
import CustomEvent from "../pages/ui/Organizer/CustomEvent";
import TransactionsPage from "../pages/ui/Organizer/Transactionspage";
import OverviewPage from "../pages/ui/Organizer/Overview";
import CreateEvents from "../pages/ui/Organizer/CreateEvents";
import MyEvent from "../pages/ui/Organizer/MyEvent";
import SuperAdminOverview from "../pages/ui/Admin/AdminOverview";
import SuperAdminUsers from "../pages/ui/Admin/AdminUsers";
import SuperAdminSchools from "../pages/ui/Admin/AdminSchools";
import MyOrganizers from "../pages/ui/SchoolAdmin/MyOrganizer";

const router = createBrowserRouter([
    {   element:<DashboardLayout/>,
        children:[
        {
            path:'/',
            element:<Home/>
        },
        {
            path:'/aboutUs',
            element:<About/>
        }
        ]
    },
    {
        element:<AdminDashbboardLayout/>,
        children:[
            {
                path:'/overview',
                element:<OverviewPage/>
            },
            {
                path:'/createEvent',
                element:<CreateEvents/>
            },
            {
                path:'/myEvent',
                element:<MyEvent/>
            },
            {
                path:'/transaction',
                element:<TransactionsPage/>
            },{
                path:'/superAdmin/overview',
                element:<SuperAdminOverview/>
            },{
                path:'/superAdmin/users',
                element:<SuperAdminUsers/>
            },{
                path:'/schoolAdmin/organizer',
                element:<MyOrganizers/>
            },{
                path:'/superAdmin/schools',
                element:<SuperAdminSchools/>
            }

        ]
    },
    {
        element:<SignUp/>,
        path:'/SignUp'
    },
    {
        element:<LogIn/>,
        path:'/logIn'
    },
    {
        element:<CustomEvent/>,
        path:'/CustomEvent'
    },

])
export default router