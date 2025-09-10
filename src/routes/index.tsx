import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/ui/public/Home";
import About from "../pages/ui/public/About";
import DashboardLayout from "../pages/components/public/dashboardLayout";
import SignUp from "../pages/components/public/SignUp";
import LogIn from "../pages/components/public/LogIn";
import AdminDashbboardLayout from "../pages/components/Organizer/adminDashbboardLayout";
import CreateEvent from "../pages/ui/Organizer/CreateEvent";
import CustomEvent from "../pages/ui/Organizer/CustomEvent";
import TransactionsPages from "../pages/ui/file";
import TransactionsPage from "../pages/ui/Organizer/Transactionspage";
import OverviewPage from "../pages/ui/Organizer/Overview";
import CreateEventPage from "../pages/ui/Organizer/MyEvent";
import CreateEvents from "../pages/ui/Organizer/CreateEvents";
import MyEvent from "../pages/ui/Organizer/MyEvent";
import MyEventsPage from "../pages/ui/file";
import SuperAdminOverview from "../pages/ui/Admin/AdminOverview";
import SuperAdminUsers from "../pages/ui/Admin/AdminUsers";
import SuperAdminSchools from "../pages/ui/Admin/AdminSchools";

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
                // element:<MyEventsPage/>
                // element:<CreateEvent/>
                element:<TransactionsPage/>
            },{
                path:'/superAdmin/overview',
                element:<SuperAdminOverview/>
            },{
                path:'/superAdmin/users',
                element:<SuperAdminUsers/>
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
        element:<TransactionsPages/>,
        path:'/newTransaction'
    },
    {
        element:<CustomEvent/>,
        path:'/CustomEvent'
    },

])
export default router