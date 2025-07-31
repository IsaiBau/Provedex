import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboard from "../../Dashboard";
import axios from "axios";

export default function CategoriesForm() {
  const { uuid } = useParams(); 
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState("");
  
  // Estados para los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    color:""
  });
  
  // Validaciones
  const [errors, setErrors] = useState({
    name: false,
    color: false
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Si hay UUID, cargar los datos de la entrega a editar
        if (uuid) {
          const categoryRes = await axios.get(`http://localhost:5000/categories/${uuid}`);
          const categoryData = categoryRes.data;
          
          setFormData({
            name: categoryData.name,
            color: categoryData.color
          });
          setIsEditing(true);
        }
      } catch (error) {
        setMsg(error.response?.data?.msg || "Error al cargar datos");
      }
    };
    fetchInitialData();
  }, [uuid]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      color: !formData.color
    };
    
    setErrors(newErrors);
    
    // Verificar si hay algún error
    return !Object.values(newErrors).some(error => error);
  };

  // Manejar cambios en los inputs normales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error al cambiar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (!validateForm()) {
      setMsg("Por favor complete todos los campos requeridos");
      return;
    }
    
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/categories/${uuid}`, formData);
        setMsg("Categoría actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/categories", formData);
        setMsg("Categoría creada con éxito");
        resetForm();
      }
      
      // Redirigir después de 2 segundos
      setTimeout(() => navigate("/categories"), 2000);
    } catch (error) {
      setMsg(error.response?.data?.msg || "Error al procesar la solicitud");
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: "",
      color: ""
    });

    setErrors({
      name: false,
      color: false
    });
  };

  return (
    <Dashboard title={isEditing ? "Editar Entrega" : "Nueva Entrega"}>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col gap-5">
        {/* Fecha de entrega */}
        <div className="mb-5"> 
          
          <label htmlFor="name" className="label">Nombre de la categoria*</label>
          
          <div className={`input-icon-wrapper ${errors.name ? 'border-red-500' : ''}`}>
            <input 
              value={formData.name} 
              onChange={handleChange} 
              name="name" 
              id="name" 
              type="text" 
              className="input" 
              required 
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">Este campo es requerido</p>}
        </div>
        <div className="mb-5"> 
          <label htmlFor="color" className="label">Color*</label>
          
          <div className={`input-icon-wrapper ${errors.name ? 'border-red-500' : ''}`}>
            <input 
              value={formData.color}
              onChange={handleChange} 
              name="color" 
              id="color" 
              type="color" 
              className="input" 
              required 
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">Este campo es requerido</p>}
        </div>

      {/* Mensaje de estado */}
      {msg && (
        <div className="mb-5 -mx-4">
          <p
            className={`mx-4 p-2 text-sm rounded-sm ${
              msg.includes("éxito") ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200'
            }`}
            role="alert"
          >
            {msg}
          </p>
        </div>
      )}
      {/* 
        <div className="mb-5">
            <label for="productoTitulo" className="label">Titulo de la entrega</label>
            <div class="input-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <input type="text" value={title || ""} onChange={handleChange} name="title" id="title" className="input" placeholder="Entrega de Cajas de leche" required />
            </div>  
        </div>
        */}
        {/* Botón de enviar */}
        <div className="mt-4">
          <button type="submit" className="button w-full">
            {isEditing ? "Actualizar Categoría" : "Registrar Categoría"}
          </button>
        </div>
      </form>
    </Dashboard>
  );
}