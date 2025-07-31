import { BrowserRouter, Routes, Route } from "react-router-dom";
import Entregas from "./views/Entregas";
import DeliveryTable from "./views/DeliveryTable";
import Calendar from "./views/Calendar";
import Login from "./views/Login";
import CategoriesForm from "./views/inventario/CategoriesForm";
import Categories from "./views/inventario/Categories";

function App() {

  return (
    <div>
        <Routes>
          <Route path="/entregas" element={<Entregas/>}/>
          <Route path="/entregas/:uuid" element={<Entregas/>}/>
          <Route path="/delivery" element={<DeliveryTable/>}/>
          <Route path="/calendar" element={<Calendar/>}/>
          <Route path="/" element={<Login/>}/>
          {/* Inventario */}
          <Route path="/categories" element={<Categories/>}/>
          <Route path="/categories-form" element={<CategoriesForm/>}/>
          <Route path="/categories-form/:uuid" element={<CategoriesForm/>}/>
        </Routes>

    </div>
  );
}

export default App;