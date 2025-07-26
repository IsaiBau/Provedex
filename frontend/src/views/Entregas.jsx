import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import Dashboard from "../Dashboard";
import axios from "axios";
export default function Entregas ()  {
  /*Manejo de estados */
  const [msg, setMsg] = useState("");
  const [editar, setEditar] = useState(false);
  const [deliveriesSelect, setDeliveriesSelect] = useState([]);
  /*Variables del formulario */
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [status, setStatus] = useState([]);
  const [title, setTitle] = useState(null);
  const [idProduct, setIdProduct] = useState(null);
  const [products, setProducts] = useState("");
  const [productsSelect, setProductsSelect] = useState("");
  const [idSupplier, setIdSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState("");
  const [suppliersSelect, setSuppliersSelect] = useState([]);
  
  /*Funciones para obtener datos para los select */
  useEffect(() => {
    getProducts();
    getSuppliers();
    getDeliveries();
  }, []);
  const getDeliveries = async () => {
      const response = await axios.get("http://localhost:5000/deliveries");
      setDeliveriesSelect(response.data);
  };
  const getProducts = async () => {
      const response = await axios.get("http://localhost:5000/products");
      setProductsSelect(response.data);
  };
  const getSuppliers = async () => {
      const response = await axios.get("http://localhost:5000/suppliers");
      setSuppliersSelect(response.data);
  };
  /*Funcion para agregar */
  const addDelivery = async () => {
    await axios
      .post(`http://localhost:5000/deliveries`, { 
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        status: status,
        title: title,
        product_id: idProduct,
        supplier_id: idSupplier })
      .then(() => {
        resetForm();
        setMsg("Entrega registrada con éxito");
      })
      .catch((error) => {
        setMsg(error.response.data.msg);
      });
  };

  /*Funciones para editar */

  /*Funcion para eliminar */
    const deleteDeliverie = (id) => {
    axios
      .delete(`http://localhost:5000/deliveries/${id}`)
      .then(() => {
        getDeliveries();
        resetForm();
      })
      .catch((error) => {
        setMsg(error.response.data.msg);
      });
  };
  /*Funciones para el formulario */
  const resetForm = () => {
    setDeliveryDate("");
    setDeliveryTime("");
    setStatus("");
    setTitle("");
    setProducts("");
    setIdProduct(null);
    setSuppliers("");
    setIdSupplier(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "delivery_date":
        setDeliveryDate(value);
        break;
      case "delivery_time":
        setDeliveryTime(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "title":
        setTitle(value);
        break;
      default:
        break;
    }
    /*Validaciones */
    switch (name) {
      case "delivery_date":
        if (value.length < 1) {
          setMsg("Debe seleccionar una fecha.");
        }
        break;
      case "delivery_time":
        if (value.length < 1) {
          setMsg("Debe seleccionar una hora.");
        }
        break;
      case "status":
        if (value.length < 1) {
          setMsg("Debe seleccionar un estado.");
        }
        break;
      case "product_id":
        if (value.length < 1) {
          setMsg("Debe seleccionar un producto.");
        }
        break;
      case "supplier_id":
        if (value.length < 1) {
          setMsg("Debe seleccionar un proveedor.");
        }
        break;
      default:
        break;
    }
  };
  const handleInputChangeProducts = (e) => {
    const productInput = e.target.value;
    setProducts(productInput);
    
    if (productInput === "") {
        setMsg(""); 
        setIdProduct("");
    } else {
        const selectedProduct = productsSelect.find(
        (productslist) => `${productslist.name}` === productInput
        );
    
        if (selectedProduct) {
          setIdProduct(selectedProduct.id);
          setMsg(""); 
        } else {
          setMsg("Ingrese un producto de la lista");
          setIdProduct("");
        }
    }
  };  
  const handleInputChangeSupplier = (e) => {
    const supplierInput = e.target.value;
    setSuppliers(supplierInput);
    
    if (supplierInput === "") {
        setMsg(""); 
        setIdSupplier("");
    } else {
        const selectedSupplier = suppliersSelect.find(
        (supplierlist) => `${supplierlist.name}` === supplierInput
        );
    
        if (selectedSupplier) {
          setIdSupplier(selectedSupplier.id);
          setMsg(""); 
        } else {
          setMsg("Ingrese un proveedor de la lista");
          setIdSupplier("");
        }
    }
  };  
  return (
    <Dashboard title={"Entregas"}>
        <form className="max-w-sm mx-auto flex flex-col gap-5">
        <div className="mb-5"> 
            <label for="fecha" className="label">Fecha de entrega*</label>
            <div class="input-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <input value={deliveryDate || ""} onChange={handleChange} name="delivery_date" id="delivery_date" type="date" className="input" required />
            </div>   
        </div>
        <div className="mb-5">
            <label for="hora" className="label">Hora de entrega*</label>
            <div class="input-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <input type="time" value={deliveryTime || ""} onChange={handleChange} name="delivery_time" id="delivery_time" className="input" required />
            </div>   
        </div>
        <div className="mb-5">
            <label for="estado" className="label ">Estado de la entrega*</label>
            <div class="input-icon-wrapper">
                <select value={status || ""} onChange={handleChange} name="status" id="status" className="inputSelect" multiple={false}>
                    <option value="" disabled>Seleccionar</option>
                    <option value="Completed">Completado</option>
                    <option value="Pending">Pendiente</option>
                    <option value="Rescheduled">Reagendado</option>
                    <option value="Canceled">Cancelado</option>
                    <option value="Other">Otro</option>
                </select>
            </div>  
        </div>
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
        <div className="mb-5">
          <label for="products" className="label">Producto*</label>
          <input
            value={products || ""}
            onChange={handleInputChangeProducts}
            id="id_products"
            type="text"
            autoComplete="on"
            className="inputSelect"
            placeholder="Productos"
            list="productsList"
            required
          />
          <datalist  id="productsList">
            {productsSelect.length === 0 ? (
              <option>No hay productos</option>) : (
              productsSelect.map((val, key) => (
                <option key={key} value={val.name}>
                  {val.name}
                </option>
              ))
            )}
          </datalist>
        </div>
        <div className="mb-5">
            <label for="proveedor" className="label">Proveedor*</label>
            <input
              value={suppliers || ""}
              onChange={handleInputChangeSupplier}
              id="id_products"
              type="text"
              autoComplete="on"
              className="inputSelect"
              placeholder="Provedores"
              list="suppliers"
              required
            /> 
            <datalist  id="suppliers">
              {suppliersSelect.length === 0 ? (
                <option>No hay proveedores</option>) : (
                suppliersSelect.map((val, key) => (
                  <option key={key} value={val.name}>
                    {val.name}
                  </option>
                ))
              )}
            </datalist>
        </div>
        {msg && (
          <p
            className={`text-center w-full mx-auto text-sm rounded-sm ${msg.includes("éxito") ? `text-green-800 bg-green-200`:`text-red-800 bg-red-200`} `}
            role="alert"
          >
            {msg}
          </p>
        )}
        <div className="">
            <button type="button" className="button" onClick={() => {addDelivery();}}>Registrar</button>
        </div>
        
        </form>
    </Dashboard>
  );
};