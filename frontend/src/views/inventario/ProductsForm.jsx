import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboard from "../../Dashboard";
import axios from "axios";
import inventario from "../../assets/css/inventario.module.css"

export default function ProductsForm() {
  const { uuid } = useParams(); 
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  
  // Estados para los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    min_stock: "",
    max_stock: "",
    stock: "",
    id_category: "",
    suppliers_id: ""
  });
  
  // Estados para las listas de opciones
  const [categoriesList, setCategoriesList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  
  // Estados para los valores mostrados en los inputs de datalist
  const [categoriesDisplay, setCategoriesDisplay] = useState("");
  const [supplierDisplay, setSupplierDisplay] = useState("");

  // Validaciones
  const [errors, setErrors] = useState({
    name: false,
    min_stock: false,
    max_stock: false,
    stock: false,
    id_category: false,
    suppliers_id: false
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar productos y proveedores
        const [categoriesRes, suppliersRes] = await Promise.all([
          axios.get("http://localhost:5000/categories"),
          axios.get("http://localhost:5000/suppliers")
        ]);
        
        setCategoriesList(categoriesRes.data || []);
        setSuppliersList(suppliersRes.data || []);

        // Si hay UUID, cargar los datos de la entrega a editar
        if (uuid) {
          const productRes = await axios.get(`http://localhost:5000/products/${uuid}`);
          const productData = productRes.data;
          
          setFormData({
            name: productData.name,
            min_stock: productData.min_stock,
            max_stock: productData.max_stock,
            stock: productData.stock,
            id_category: productData.id_category,
            suppliers_id: productData.suppliers_id // Asumiendo que es string (si es array necesitarás ajuste)
          });
          
          // Establecer los valores mostrados en los inputs
          const category = categoriesRes.data.find(c => c.id === productData.id_category);
          const supplier = suppliersList.find(s => s.id === productData.suppliers_id);
          
          setCategoriesDisplay(category?.name || "");
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
  // Mantenemos formData como está, pero corregimos las validaciones
  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      min_stock: !formData.min_stock || formData.min_stock < 0,
      max_stock: !formData.max_stock || formData.max_stock < formData.min_stock,
      stock: !formData.stock || formData.stock < 0,
      id_category: !formData.id_category,
      suppliers_id: !formData.suppliers_id
    };
    
    setErrors(newErrors);
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
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoriesDisplay(value);
    
    const selectedCategory = categoriesList.find(item => item.name === value);
    
    if (selectedCategory) {
      setFormData(prev => ({ ...prev, id_category: selectedCategory.id }));
      setErrors(prev => ({ ...prev, id_category: false }));
    } else {
      setFormData(prev => ({ ...prev, id_category: "" }));
      setErrors(prev => ({ ...prev, id_category: true }));
    }
  };

  // Manejar cambios en los inputs de proveedor
  const handleSupplierChange = (e) => {
    const value = e.target.value;
    setSupplierDisplay(value);
    
    // Buscar el proveedor seleccionado
    const selectedSupplier = suppliersList.find(item => item.name === value);
    
    if (selectedSupplier) {
      setFormData(prev => ({ ...prev, suppliers_id: selectedSupplier.id }));
      setErrors(prev => ({ ...prev, suppliers_id: false }));
    } else {
      setFormData(prev => ({ ...prev, suppliers_id: "" }));
      setErrors(prev => ({ ...prev, suppliers_id: true }));
    }
  };

  // Enviar formulario (crear o actualizar)
  // En tu componente ProductsForm
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMsg({ text: "Por favor complete todos los campos requeridos", type: "error" });
      return;
    }
    
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/products/${uuid}`, formData);
        setMsg({ text: "Producto actualizado con éxito", type: "success" });
        setTimeout(() => navigate("/productos"), 2000); // Redirección en edición
      } else {
        await axios.post("http://localhost:5000/products", formData);
        setMsg({ text: "Producto creado con éxito", type: "success" });
        setTimeout(() => navigate("/productos"), 2000);
      }
    } catch (error) {
      setMsg({ text: error.response?.data?.msg || "Error al procesar la solicitud", type: "error" });
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
      suppliers_id: ""
    });
    setProductDisplay("");
    setSupplierDisplay("");
    setErrors({
      delivery_date: false,
      delivery_time: false,
      status: false,
      product_id: false,
      suppliers_id: false
    });
  };

  return (
    <Dashboard title={isEditing ? "Editar Producto" : "Nuevo Producto"}>
      <div className={inventario["form-scroll-container"]}>
        <form onSubmit={handleSubmit} className={inventario["form-content"]}>
          {/* Nombre del producto */}
          <div>
            <label htmlFor="name" className="label">Nombre del producto*</label>
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

          {/* Inputs de stock */}
          <div className={inventario["stock-input-container"]}>
            <div className={inventario["stock-input-wrapper"]}>
              <label htmlFor="min_stock" className={`label ${inventario["stock-label"]}`}>
                Stock mínimo*
              </label>
              <div className={`input-icon-wrapper ${errors.min_stock ? 'border-red-500' : ''}`}>
                <input
                  type="number"
                  value={formData.min_stock}
                  onChange={handleChange}
                  name="min_stock"
                  id="min_stock"
                  className={`input ${inventario["stock-input-field"]}`}
                  required
                  min="0"
                />
              </div>
              {errors.min_stock && <p className="text-red-500 text-xs mt-1">Valor inválido</p>}
            </div>

            <div className={inventario["stock-input-wrapper"]}>
              <label htmlFor="max_stock" className={`label ${inventario["stock-label"]}`}>
                Stock máximo*
              </label>
              <div className={`input-icon-wrapper ${errors.max_stock ? 'border-red-500' : ''}`}>
                <input
                  type="number"
                  value={formData.max_stock}
                  onChange={handleChange}
                  name="max_stock"
                  id="max_stock"
                  className={`input ${inventario["stock-input-field"]}`}
                  required
                  min={formData.min_stock || 0}
                />
              </div>
              {errors.max_stock && <p className="text-red-500 text-xs mt-1">Debe ser mayor al stock mínimo</p>}
            </div>
          </div>

          {/* Stock actual */}
          <div>
            <label htmlFor="stock" className="label">Stock actual*</label>
            <div className={`input-icon-wrapper ${errors.stock ? 'border-red-500' : ''}`}>
              <input 
                value={formData.stock} 
                onChange={handleChange} 
                name="stock" 
                id="stock" 
                type="number" 
                className="input" 
                required 
                min="0"
              />
            </div>
            {errors.stock && <p className="text-red-500 text-xs mt-1">Valor inválido</p>}
          </div>

          {/* Categoría */}
          <div className="mb-5">
            <label htmlFor="category" className="label">Categoría*</label>
            <input
              value={categoriesDisplay}
              onChange={handleCategoryChange}
              id="category"
              type="text"
              autoComplete="off"
              className={`inputSelect ${errors.id_category ? 'border-red-500' : ''}`}
              placeholder="Seleccione una categoría"
              list="categoriesList"
              required
            />
            <datalist id="categoriesList">
              {categoriesList.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </datalist>
            {errors.id_category && <p className="text-red-500 text-xs mt-1">Seleccione una categoría válida</p>}
          </div>

          {/* Proveedor (versión temporal con datalist) */}
          <div className="mb-5">
            <label htmlFor="supplier" className="label">Proveedor*</label>
            <input
              value={supplierDisplay}
              onChange={handleSupplierChange}
              id="supplier"
              type="text"
              autoComplete="off"
              className={`inputSelect ${errors.suppliers_id ? 'border-red-500' : ''}`}
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
            {errors.suppliers_id && <p className="text-red-500 text-xs mt-1">Seleccione un proveedor válido</p>}
          </div>
          {msg.text && (
            <div className={`mb-4 p-3 rounded-md ${
              msg.type === "success" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {msg.text}
            </div>
          )}
          {/* Botón de enviar */}
          <div className={inventario["form-button-container"]}>
            <button type="submit" className="button w-full">
              {isEditing ? "Actualizar Producto" : "Registrar Producto"}
            </button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
}