import './App.css'
import {RouterProvider } from 'react-router-dom';
import router from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
    return <>
      <RouterProvider router={router}/>
      <ToastContainer position="bottom-right" autoClose={2000}  newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>;

}

export default App
