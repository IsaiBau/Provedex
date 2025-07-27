import { BrowserRouter, Routes, Route } from "react-router-dom";
import Entregas from "./views/Entregas";
import DeliveryTable from "./views/DeliveryTable";
import Calendar from "./views/Calendar";
import Login from "./views/Login";

function App() {

  return (
    <div>
        <Routes>
          <Route path="/entregas" element={<Entregas/>}/>
          <Route path="/entregas/:uuid" element={<Entregas/>}/>
          <Route path="/delivery" element={<DeliveryTable/>}/>
          <Route path="/calendar" element={<Calendar/>}/>
          <Route path="/" element={<Login/>}/>
        </Routes>

    </div>
  );
}

export default App;