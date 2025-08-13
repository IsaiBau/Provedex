import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/AuthSlice";
import styles from "../assets/css/login.module.css";
import Logo from "../assets/img/logo.png";
import { NavLink } from "react-router-dom"
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        userNotification();
      } else {
        console.warn("Permiso de notificación denegado");
      }
    });
    sendEmailReminder();
    navigate("/delivery");
  }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = async (e) => {
    e.preventDefault();
    if (!email || !password) return; 
    
    await dispatch(LoginUser({ email, password }));
  };

  //para susvribir al usuario
  async function userNotification() {
    const registration = await navigator.serviceWorker.ready;
    console.log("Service Worker listo:", registration);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
    });
    console.log("Enviando suscripción:", subscription);
    const res = await fetch(`${apiUrl}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription)
    });

  const result = await res.json();
    console.log("Respuesta del backend:", result);
        console.log("Suscripción enviada");
      }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  async function sendEmailReminder() {
    try {
      const response = await fetch(`${apiUrl}/send-reminders`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error("Error al enviar recordatorios");
      
      const data = await response.json();
      console.log("Recordatorios enviados:", data);
    } catch (error) {
      console.error("Error al enviar recordatorios:", error);
    }
  }
  return (
    <div className={styles.container}>
      <div>
        <img src={Logo} alt="Logo" className="avatar-img" />
        <h2 className={styles.title}>Login</h2>
      </div>

      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={Auth}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"  
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="email@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelContainer}>
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={styles.input}
            />
            {/* Mensaje de error debajo del campo de contraseña */}
            {isError && (
              <p className={styles.errorMessage}>
                {message}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading}  // Deshabilitar botón durante carga
          >
            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
          <p>
            ¿Olvidaste tu contraseña? <NavLink className={"text-blue-700"} to={"/recovery-password"}>Recuperala aquí</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;