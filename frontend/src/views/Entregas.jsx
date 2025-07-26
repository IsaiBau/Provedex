import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard";
import axios from "axios";

export default function Entregas() {
  const { uuid } = useParams(); 
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState("");
  
  // Estados para los datos del formulario
  const [formData, setFormData] = useState({
    delivery_date: "",
    delivery_time: "",
    status: "",
    title: "",
    product_id: "",
    supplier_id: ""
  });
  
  // Estados para las listas de opciones
  const [productsList, setProductsList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  
  // Estados para los valores mostrados en los inputs de datalist
  const [productDisplay, setProductDisplay] = useState("");
  const [supplierDisplay, setSupplierDisplay] = useState("");

  // Validaciones
  const [errors, setErrors] = useState({
    delivery_date: false,
    delivery_time: false,
    status: false,
    product_id: false,
    supplier_id: false
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar productos y proveedores
        const [productsRes, suppliersRes] = await Promise.all([
          axios.get("http://localhost:5000/products"),
          axios.get("http://localhost:5000/suppliers")
        ]);
        
        setProductsList(productsRes.data || []);
        setSuppliersList(suppliersRes.data || []);

        // Si hay UUID, cargar los datos de la entrega a editar
        if (uuid) {
          const deliveryRes = await axios.get(`http://localhost:5000/deliveries/${uuid}`);
          const deliveryData = deliveryRes.data;
          
          setFormData({
            delivery_date: deliveryData.delivery_date,
            delivery_time: deliveryData.delivery_time.split('T')[1].substring(0, 5),
            status: deliveryData.status,
            title: deliveryData.title || "",
            product_id: deliveryData.product_id,
            supplier_id: deliveryData.supplier_id
          });
          
          // Establecer los valores mostrados en los inputs
          const product = productsRes.data.find(p => p.id === deliveryData.product_id);
          const supplier = suppliersRes.data.find(s => s.id === deliveryData.supplier_id);
          
          setProductDisplay(product?.name || "");
          setSupplierDisplay(supplier?.name || "");
          
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
      delivery_date: !formData.delivery_date,
      delivery_time: !formData.delivery_time,
      status: !formData.status,
      product_id: !formData.product_id,
      supplier_id: !formData.supplier_id
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

  // Manejar cambios en los inputs de producto
  const handleProductChange = (e) => {
    const value = e.target.value;
    setProductDisplay(value);
    
    // Buscar el producto seleccionado
    const selectedProduct = productsList.find(item => item.name === value);
    
    if (selectedProduct) {
      setFormData(prev => ({ ...prev, product_id: selectedProduct.id }));
      setErrors(prev => ({ ...prev, product_id: false }));
    } else {
      setFormData(prev => ({ ...prev, product_id: "" }));
      setErrors(prev => ({ ...prev, product_id: true }));
    }
  };

  // Manejar cambios en los inputs de proveedor
  const handleSupplierChange = (e) => {
    const value = e.target.value;
    setSupplierDisplay(value);
    
    // Buscar el proveedor seleccionado
    const selectedSupplier = suppliersList.find(item => item.name === value);
    
    if (selectedSupplier) {
      setFormData(prev => ({ ...prev, supplier_id: selectedSupplier.id }));
      setErrors(prev => ({ ...prev, supplier_id: false }));
    } else {
      setFormData(prev => ({ ...prev, supplier_id: "" }));
      setErrors(prev => ({ ...prev, supplier_id: true }));
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
        await axios.put(`http://localhost:5000/deliveries/${uuid}`, formData);
        setMsg("Entrega actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/deliveries", formData);
        setMsg("Entrega creada con éxito");
        resetForm();
      }
      
      // Redirigir después de 2 segundos
      setTimeout(() => navigate("/delivery"), 2000);
    } catch (error) {
      setMsg(error.response?.data?.msg || "Error al procesar la solicitud");
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      delivery_date: "",
      delivery_time: "",
      status: "",
      title: "",
      product_id: "",
      supplier_id: ""
    });
    setProductDisplay("");
    setSupplierDisplay("");
    setErrors({
      delivery_date: false,
      delivery_time: false,
      status: false,
      product_id: false,
      supplier_id: false
    });
  };

  return (
    <Dashboard title={isEditing ? "Editar Entrega" : "Nueva Entrega"}>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col gap-5">
        {/* Fecha de entrega */}
        <div className="mb-5"> 
          
          <label htmlFor="delivery_date" className="label">Fecha de entrega*</label>
          
          <div className={`input-icon-wrapper ${errors.delivery_date ? 'border-red-500' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <input 
              value={formData.delivery_date} 
              onChange={handleChange} 
              name="delivery_date" 
              id="delivery_date" 
              type="date" 
              className="input" 
              required 
            />
          </div>
          {errors.delivery_date && <p className="text-red-500 text-xs mt-1">Este campo es requerido</p>}
        </div>

        {/* Hora de entrega */}
        <div className="mb-5">
          <label htmlFor="delivery_time" className="label">Hora de entrega*</label>
          <div className={`input-icon-wrapper ${errors.delivery_time ? 'border-red-500' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <input 
              type="time" 
              value={formData.delivery_time} 
              onChange={handleChange} 
              name="delivery_time" 
              id="delivery_time" 
              className="input" 
              required 
            />
          </div>
          {errors.delivery_time && <p className="text-red-500 text-xs mt-1">Este campo es requerido</p>}
        </div>

        {/* Estado */}
        <div className="mb-5">
          <label htmlFor="status" className="label">Estado de la entrega*</label>
          <div className={`input-icon-wrapper ${errors.status ? 'border-red-500' : ''}`}>
            <select 
              value={formData.status} 
              onChange={handleChange} 
              name="status" 
              id="status" 
              className="inputSelect" 
              required
            >
              <option value="" disabled>Seleccionar</option>
              <option value="Completed">Completado</option>
              <option value="Pending">Pendiente</option>
              <option value="Rescheduled">Reagendado</option>
              <option value="Canceled">Cancelado</option>
              <option value="Other">Otro</option>
            </select>
          </div>
          {errors.status && <p className="text-red-500 text-xs mt-1">Este campo es requerido</p>}
        </div>

        {/* Producto */}
        <div className="mb-5">
          <label htmlFor="product" className="label">Producto*</label>
          <input
            value={productDisplay}
            onChange={handleProductChange}
            id="product"
            type="text"
            autoComplete="off"
            className={`inputSelect ${errors.product_id ? 'border-red-500' : ''}`}
            placeholder="Seleccione un producto"
            list="productsList"
            required
          />
          <datalist id="productsList">
            {productsList.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </datalist>
          {errors.product_id && <p className="text-red-500 text-xs mt-1">Seleccione un producto válido</p>}
        </div>

        {/* Proveedor */}
        <div className="mb-5">
          <label htmlFor="supplier" className="label">Proveedor*</label>
          <input
            value={supplierDisplay}
            onChange={handleSupplierChange}
            id="supplier"
            type="text"
            autoComplete="off"
            className={`inputSelect ${errors.supplier_id ? 'border-red-500' : ''}`}
            placeholder="Seleccione un proveedor"
            list="suppliersList"
            required
          /> 
          <datalist id="suppliersList">
            {suppliersList.map((supplier) => (
              <option key={supplier.id} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </datalist>
          {errors.supplier_id && <p className="text-red-500 text-xs mt-1">Seleccione un proveedor válido</p>}
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
            {isEditing ? "Actualizar Entrega" : "Registrar Entrega"}
          </button>
        </div>
      </form>
    </Dashboard>
  );
}