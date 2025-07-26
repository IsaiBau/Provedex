import "./Dashboard.css";
import User from "/Person-1.jpg";
import { NavLink } from "react-router-dom"
 
const Dashboard = ({title, children}) => {
  return (
    <div className="dashboard">
      {/* Barra superior */}
      <header className="top-bar">
        <div className="logo">PROVIDEX</div>
        <div className="user-profile">
          <div className="user-info">
            <span className="username">Edgar Ortiz</span>
            <span className="user-role">Dueño</span>
          </div>
          <div className="user-avatar">
            <img src={User} alt="User Avatar" className="avatar-img" />
          </div>
          <button className="logout-btn">
            <img
              src="https://cdn-icons-png.flaticon.com/512/992/992680.png"
              alt="Logout"
              className="logout-icon"
            />
          </button>
        </div>
      </header>

      {/* Contenedor principal */}
      <div className="main-container">
        {/* Menú lateral */}
        <aside className="sidebar">
          <nav>
            <ul className="menu">
              <li className="menu-item"><NavLink to={"/productos"}>Productos</NavLink></li>
              <li className="menu-item"><NavLink to={"/proveedores"}>Proveedores</NavLink></li>
              <li className="menu-item"><NavLink to={"/delivery"}>Entregas</NavLink></li>
            </ul>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="content">
          {/* Tarjeta de calendario */}
          <div className="card">
            <div className="card-header">
              <h2>{title}</h2>
            </div>
            <div className="flex justify-center w-full">
              {children}
            </div>
              
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
