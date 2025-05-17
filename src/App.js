//import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route,Routes} from "react-router-dom"
import { Register } from './components/Register/Register';
import {Login} from "./components/Login/Login"
import {Dashboard} from "./components/Dashboard/Dashboard"

function App() {
  return (
    // <div >
    //   <Register/>
    // </div>
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
