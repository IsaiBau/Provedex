import { BrowserRouter, Routes, Route } from "react-router-dom";
import Entregas from "./views/Entregas";
import DeliveryTable from "./views/DeliveryTable";

function App() {

  return (
    <div>
        <Routes>
          <Route path="/entregas" element={<Entregas/>}/>
          <Route path="/delivery" element={<DeliveryTable/>}/>
        </Routes>

    </div>
  );
}

export default App;