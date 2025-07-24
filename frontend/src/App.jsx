import { BrowserRouter, Routes, Route } from "react-router-dom";
import Entregas from "./views/Entregas";

function App() {

  return (
    <div>
        <Routes>
          <Route path="/entregas" element={<Entregas/>}/>
        </Routes>

    </div>
  );
}

export default App;