import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/ui/public/Home";
import About from "../pages/ui/public/About";
import DashboardLayout from "../pages/components/public/dashboardLayout";
import SignUp from "../pages/components/public/SignUp";
import LogIn from "../pages/components/public/LogIn";
import AdminDashbboardLayout from "../pages/components/Organizer/adminDashbboardLayout";
import Overview from "../pages/ui/Organizer/Overview";
import CreateEvent from "../pages/ui/Organizer/CreateEvent";
import EventBuilder from "../pages/ui/Organizer/EventBuilder";
import CustomEvent from "../pages/ui/Organizer/CustomEvent";

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
                element:<Overview/>
            },
            {
                path:'/createEvent',
                element:<CreateEvent/>
            },
            {
                path:'/myEvent'
            },
            {
                path:'/myEvent'
            },
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
        element:<EventBuilder/>,
        path:'/BuildEvent'
    },
    {
        element:<CustomEvent/>,
        path:'/CustomEvent'
    },
])
export default router