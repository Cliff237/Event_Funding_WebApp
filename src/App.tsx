
import './App.css'
import {RouterProvider } from 'react-router-dom';
import router from './routes';
import { PaymentGetSetup } from './pages/ui/Organizer/CustomePay_receipt_page';
import CustomEvent from './pages/ui/Organizer/CustomEvent';
import TransactionsPage from './pages/ui/Organizer/Transactionspage';
import TransactionsPages from './pages/ui/file';
import MyEventsPage from './pages/ui/file';

function App() {
    return <RouterProvider router={router}/>;
    return <MyEventsPage/>
    return <TransactionsPages/>
    return <TransactionsPage/>
    return <PaymentGetSetup/>
    return <CustomEvent/>
}

export default App

