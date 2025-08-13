import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboard from "../../Dashboard";
import axios from "axios";

export default function SuppliersForm() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    representative: ""
  });

  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    representative: false
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (uuid) {
          const res = await axios.get(`${apiUrl}/suppliers/${uuid}`);
          const data = res.data;
          setFormData({
            name: data.name,
            phone: data.phone || "",
            representative: data.representative || ""
          });
          setIsEditing(true);
        }
      } catch (error) {
        setMsg(error.response?.data?.msg || "Error al cargar proveedor");
      }
    };
    fetchInitialData();
  }, [uuid]);

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      phone: false, 
      representative: false 
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMsg("Por favor complete los campos obligatorios");
      return;
    }

    try {
      if (isEditing) {
        await axios.patch(`${apiUrl}/suppliers/${uuid}`, formData);
        setMsg("Proveedor actualizado con éxito");
      } else {
        await axios.post(`${apiUrl}/suppliers`, formData);
        setMsg("Proveedor registrado con éxito");
        resetForm();
      }

      setTimeout(() => navigate("/proveedores"), 2000);
    } catch (error) {
      setMsg(error.response?.data?.msg || "Error al guardar proveedor");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      representative: ""
    });
    setErrors({
      name: false,
      phone: false,
      representative: false
    });
  };

  return (
    <Dashboard title={isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col gap-5">
        {/* Nombre */}
        <div className="mb-5">
          <label htmlFor="name" className="label">Nombre*</label>
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

        {/* Teléfono */}
        <div className="mb-5">
          <label htmlFor="phone" className="label">Teléfono</label>
          <div className="input-icon-wrapper">
            <input
              value={formData.phone}
              onChange={handleChange}
              name="phone"
              id="phone"
              type="text"
              className="input"
              placeholder="Ej: +34 600 123 456"
            />
          </div>
        </div>

        {/* Representante */}
        <div className="mb-5">
          <label htmlFor="representative" className="label">Representante</label>
          <div className="input-icon-wrapper">
            <input
              value={formData.representative}
              onChange={handleChange}
              name="representative"
              id="representative"
              type="text"
              className="input"
              placeholder="Nombre del representante"
            />
          </div>
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

        {/* Botón */}
        <div className="mt-4">
          <button type="submit" className="button w-full">
            {isEditing ? "Actualizar Proveedor" : "Registrar Proveedor"}
          </button>
        </div>
      </form>
    </Dashboard>
  );
}
