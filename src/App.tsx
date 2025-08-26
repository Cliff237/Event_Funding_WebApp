
import './App.css'
import {RouterProvider } from 'react-router-dom';
import router from './routes';
import { PaymentGetSetup } from './pages/ui/Organizer/CustomePay_receipt_page';
import OverviewPage from './pages/ui/file';
import CustomEvent from './pages/ui/Organizer/CustomEvent';

function App() {
    return <RouterProvider router={router}/>;
    return <PaymentGetSetup/>
    return <CustomEvent/>
    return <OverviewPage/>

}

export default App

