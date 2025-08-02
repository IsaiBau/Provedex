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
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/entregas");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return; 
    }
    dispatch(LoginUser({ email, password }));
  };
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