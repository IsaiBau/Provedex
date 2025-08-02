import React, { useDebugValue, useEffect, useState, useContext } from 'react';
import "./Dashboard.css";
import User from "/Person-1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom"
import { getMe,LogOut, reset } from "../src/features/AuthSlice";
const Dashboard = ({title, children}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  }
  return (
    <div className="dashboard">
      {/* Barra superior */}
      <header className="top-bar">
        <div className="logo">PROVEDEX</div>
        <div className="user-profile">
          <div className="user-info">
            <span className="username"><NavLink to={"/profile"}>{user?.name || 'Usuario'}</NavLink></span>
            <span className="user-role"><NavLink  to={"/profile"}>{user?.rol || 'Rol'}</NavLink></span>
          </div>
          <div className="user-avatar">
            <img src={User} alt="User Avatar" className="avatar-img" />
          </div>
          <button onClick={logout} className="logout-btn">
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
              <li className="menu-item"><NavLink to={"/categories"}>Categorias de productos</NavLink></li>
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
