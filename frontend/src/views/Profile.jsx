import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { LogOut, reset } from "../features/AuthSlice";  
import { NavLink } from "react-router-dom";
import styles from '../assets/css/profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
console.log(user)
  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="dashboard">
      {/* Barra superior modificada */}
      <header className="top-bar">
        <button 
          onClick={goBack} 
          className="p-2 rounded-full hover:bg-purple-200 transition-colors"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/709/709624.png"
            alt="Regresar"
            className="w-6 h-6 opacity-70 hover:opacity-100"
          />
        </button>
        <div className="logo">PROVEDEX</div>
        <div className="user-profile">
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
              <li className="menu-item"><a href="/categories">Categorias de productos</a></li>
              <li className="menu-item"><a href="/productos">Productos</a></li>
              <li className="menu-item"><a href="/proveedores">Proveedores</a></li>
              <li className="menu-item"><a href="/delivery">Entregas</a></li>
            </ul>
          </nav>
        </aside>

        {/* Contenido principal - Perfil */}
        <main className={styles.profileContainer}>
          <div className={`${styles.card} bg-white shadow-md`}>
            <div className={`${styles.cardHeader} bg-purple-100 border-b border-purple-950`}>
              <h2 className="text-2xl font-semibold text-gray-800">Mi Perfil</h2>
            </div>
            <div className={styles.profileContent}>
              <div className={styles.profileInfo}>
                <div className={styles.profileField}>
                  <label className="text-sm font-medium text-gray-600">Nombre:</label>
                  <p className="text-xl font-medium text-gray-800 p-2 bg-gray-50 rounded">
                    {user?.name || 'No disponible'}
                  </p>
                </div>
                
                <div className={styles.profileField}>
                  <label className="text-sm font-medium text-gray-600">Correo electrónico:</label>
                  <p className="text-gray-800 p-2 bg-gray-50 rounded">
                    {user?.email || 'No disponible'}
                  </p>
                </div>
                
                <div className={styles.profileField}>
                  <label className="text-sm font-medium text-gray-600">Rol:</label>
                  <p className="text-gray-800 p-2 bg-gray-50 rounded">
                    {user?.rol || 'No disponible'}
                  </p>
                </div>
                
                <button className={`${styles.changePasswordBtn} px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-900 transition-colors`}>
                  <NavLink to={"/recovery-password"}>Reestablecer contraseña</NavLink>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;