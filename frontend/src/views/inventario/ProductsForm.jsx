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
    suppliers_id: [] // Cambiado a array
  });
  
  // Estados para las listas de opciones
  const [categoriesList, setCategoriesList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  
  // Estado para el valor mostrado en el input de categoría
  const [categoriesDisplay, setCategoriesDisplay] = useState("");

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
        // Cargar categorías y proveedores
        const [categoriesRes, suppliersRes] = await Promise.all([
          axios.get("http://localhost:5000/categories"),
          axios.get("http://localhost:5000/suppliers")
        ]);
        
        setCategoriesList(categoriesRes.data || []);
        setSuppliersList(suppliersRes.data || []);

        // Si hay UUID, cargar los datos del producto a editar
        if (uuid) {
          const productRes = await axios.get(`http://localhost:5000/products/${uuid}`);
          const productData = productRes.data;
          
          console.log("Datos del producto recibidos:", productData); // Log para diagnóstico
          
          // Obtener los IDs de los proveedores (convertidos a string para consistencia)
          const suppliersIds = productData.product_suppliers // Se cambio de ProductSuppliers a product_suppliers
            ? productData.product_suppliers.map(ps => String(ps.supplier_id))
            : [];
          
          console.log("IDs de proveedores a mostrar:", suppliersIds); // Log para diagnóstico
          
          setFormData({
            name: productData.name,
            min_stock: productData.min_stock,
            max_stock: productData.max_stock,
            stock: productData.stock,
            id_category: productData.id_category,
            suppliers_id: suppliersIds 
          });
          
          // Establecer el valor mostrado en el input de categoría
          const category = categoriesRes.data.find(c => c.id === productData.id_category);
          setCategoriesDisplay(category?.name || "");
          
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error); // Log mejorado
        setMsg(error.response?.data?.msg || "Error al cargar datos");
      }
    };

    fetchInitialData();
  }, [uuid]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      min_stock: !formData.min_stock || formData.min_stock < 0,
      max_stock: !formData.max_stock || formData.max_stock < formData.min_stock,
      stock: !formData.stock || formData.stock < 0,
      id_category: !formData.id_category,
      suppliers_id: formData.suppliers_id.length === 0 // Validar que haya al menos un proveedor
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

  // Manejar cambios en la selección múltiple de proveedores
  const handleSupplierChange = (e) => {
    const options = e.target.options;
    const selectedSuppliers = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedSuppliers.push(options[i].value);
      }
    }
    
    setFormData(prev => ({ 
      ...prev, 
      suppliers_id: selectedSuppliers 
    }));
    
    // Limpiar error si se selecciona al menos un proveedor
    setErrors(prev => ({ 
      ...prev, 
      suppliers_id: selectedSuppliers.length === 0 
    }));
  };

  // Enviar formulario (crear o actualizar)
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
        setTimeout(() => navigate("/productos"), 2000);
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
      name: "",
      min_stock: "",
      max_stock: "",
      stock: "",
      id_category: "",
      suppliers_id: []
    });
    setCategoriesDisplay("");
    setErrors({
      name: false,
      min_stock: false,
      max_stock: false,
      stock: false,
      id_category: false,
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

          {/* Inputs de stock minimo*/}
          <div>
            <label htmlFor="min_stock" className="label">Stock mínimo*</label>
            <div className={`input-icon-wrapper ${errors.name ? 'border-red-500' : ''}`}>
            <input
              type="number"
              value={formData.min_stock}
              onChange={handleChange}
              name="min_stock"
              id="min_stock"
              className="input" 
              required
              min="0"        
            />
            </div>
            {errors.min_stock && <p className={inventario["error-message"]}>Valor inválido</p>}
          </div>

          {/* Inputs de stock maximo*/}
          <div>
            <label htmlFor="max_stock" className="label">
              Stock máximo*
            </label>
            <div className={`input-icon-wrapper ${errors.name ? 'border-red-500' : ''}`}>
              <input
                type="number"
                value={formData.max_stock}
                onChange={handleChange}
                name="max_stock"
                id="max_stock"
                className="input"
                required
                min={formData.min_stock || 0}
              />
            </div>
            {errors.max_stock && <p className={inventario["error-message"]}>Debe ser mayor al stock mínimo</p>}
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
          <div className={inventario["input-container"]}>
            <label htmlFor="category" className={inventario.label}>Categoría*</label>
            <input
              value={categoriesDisplay}
              onChange={handleCategoryChange}
              id="category"
              type="text"
              autoComplete="off"
              className="input"
              placeholder="Seleccione una categoría"
              list="categoriesList"
              required/>
            <datalist id="categoriesList">
              {categoriesList.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </datalist>
            {errors.id_category && <p className={inventario["error-message"]}>Seleccione una categoría válida</p>}
          </div>

          {/* Proveedores */}
          <div className="mb-5">
            <label htmlFor="suppliers" className={inventario.label}>
              Proveedor(es)*
            </label>
            <select
              multiple
              value={formData.suppliers_id}
              onChange={handleSupplierChange}
              id="suppliers"
              className={`border rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                errors.suppliers_id ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              size={Math.min(5, suppliersList.length)}
              style={{
                minHeight: '120px',
                scrollbarColor: '#f59e0b #fef3c7'
              }}
            >
              {suppliersList.map((supplier) => (
                <option 
                  key={supplier.id} 
                  value={String(supplier.id)}
                  className="p-2 hover:bg-amber-100"
                >
                  {supplier.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Mantén presionada la tecla Ctrl (Windows) para seleccionar múltiples opciones.
            </p>
            {errors.suppliers_id && (
              <p className="mt-1 text-xs text-red-600">Seleccione al menos un proveedor</p>
            )}
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