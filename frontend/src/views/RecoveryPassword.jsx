import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import styles from "../assets/css/login.module.css";
import Logo from "../assets/img/logo.png";
import axios from "axios";

const RecoveryPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Nueva contraseña
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/enviar-codigo', { email });
      setMessage({ text: response.data.msg, type: "success" });
      setStep(2);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.msg || "Error al enviar el código", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/verificar-codigo', { 
        email, 
        codigo: code 
      });
      setMessage({ text: response.data.msg, type: "success" });
      setStep(3);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.msg || "Código inválido", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden", type: "error" });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.patch('http://localhost:5000/actualizar-password', {
        email,
        codigo: code,
        newPassword
      });
      
      setMessage({ text: response.data.msg, type: "success" });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.msg || "Error al actualizar contraseña", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <img src={Logo} alt="Logo" className="avatar-img" />
        <h1 className={styles.title}>Recuperar contraseña</h1>
      </div>

      {message.text && (
        <div className={`${styles.message} ${message.type === "error" ? styles.error : styles.success}`}>
          {message.text}
        </div>
      )}

      <div className={styles.formContainer}>
        {step === 1 && (
          <form className={styles.form} onSubmit={handleSendCode}>
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
            <button 
              type="submit" 
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className={styles.form} onSubmit={handleVerifyCode}>
            <div className={styles.inputGroup}>
              <label htmlFor="code" className={styles.label}>
                Código de verificación
              </label>
              <input
                id="code"
                type="text"
                name="code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={styles.input}
                placeholder="Ingresa el código de 6 dígitos"
              />
              <small className={styles.smallText}>
                Revisa tu correo electrónico. El código expira en 15 minutos.
              </small>
            </div>
            <button 
              type="submit" 
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Verificar código'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form className={styles.form} onSubmit={handleUpdatePassword}>
            <div className={styles.inputGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                Nueva contraseña
              </label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                required
                minLength="6"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                minLength="6"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            <button 
              type="submit" 
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        )}

        <p className={styles.textCenter}>
          ¿Ya tienes una cuenta? <NavLink className={styles.link} to={"/"}>Inicia sesión</NavLink>
        </p>
      </div>
    </div>
  );
};

export default RecoveryPassword;