
import './App.css'
import {RouterProvider } from 'react-router-dom';
import router from './routes';
import EventBuilder from './pages/ui/Organizer/EventBuilder';
import { PaymentGetSetup } from './pages/ui/Organizer/CustomePay_receipt_page';
import OverviewPage from './pages/ui/file';

function App() {
    // return <OverviewPage/>
return <PaymentGetSetup/>
 return <RouterProvider router={router}/>;
return <EventBuilder/>

}

export default App

