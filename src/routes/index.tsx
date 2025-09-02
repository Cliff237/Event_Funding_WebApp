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
import Overview from "../pages/ex";

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
                element:<CreateEvent/>
            },
            {
                path:'/myEvent',
                element:<CreateEventPage/>
            },
            {
                path:'/transaction',
                // element:<TransactionsPage/>
                element:<Overview/>
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