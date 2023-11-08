import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./components/Login";
import Register from "./components/Register";
import Chattingnow from "./components/Chattingnow";
import { ProtectRoute } from "./components/ProtectRoute";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/chattingnow/login" element={<Login/>}/>
        <Route path="/chattingnow/register" element={<Register/>}/>
        <Route path='/' element={<ProtectRoute>
          <Chattingnow/> </ProtectRoute>  } />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
