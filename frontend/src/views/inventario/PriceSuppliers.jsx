import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Dashboard from "../../Dashboard.jsx";
import Tabla from "../../components/Tabla.jsx";

export default function PriceSuppliers() {
  const { uuid } = useParams();
  const [suppliersData, setSuppliersData] = useState([]);
  const [productInfo, setProductInfo] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Cargar y formatear datos del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products/${uuid}`);
        console.log("Datos completos:", response.data);
        
        setProductInfo({
          name: response.data.name,
          uuid: response.data.uuid
        });

        const formattedSuppliers = response.data.product_suppliers?.map(ps => ({
          id: ps.id,
          uuid: ps.uuid, 
          supplier_id: ps.supplier_id,
          supplier_name: ps.supplier?.name || "Sin nombre",
          current_price: ps.price,
          current_delivery: ps.delivery_time
        })) || [];

        console.log("Proveedores formateados:", formattedSuppliers);
        setSuppliersData(formattedSuppliers);

        const initialEditData = {};
        formattedSuppliers.forEach(ps => {
          initialEditData[ps.uuid] = {
            price: ps.current_price !== null ? ps.current_price.toString() : "",
            delivery_time: ps.current_delivery !== null ? ps.current_delivery.toString() : ""
          };
        });
        setEditData(initialEditData);

      } catch (error) {
        console.error("Error al cargar producto:", error);
        setMessage({ 
          text: error.response?.data?.msg || "Error al cargar el producto", 
          type: "error" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [uuid]);

  // Manejar cambios en los inputs de edición
  const handleInputChange = (supplierUuid, field, value) => {
    setEditData(prev => ({
      ...prev,
      [supplierUuid]: {
        ...prev[supplierUuid],
        [field]: value
      }
    }));
  };
  // Ir al formulario de editar producto para añadir proveedores
  const handleAddSupplier = () => {
    navigate(`/products-form/${productInfo.uuid}`);
  };
  // Guardar cambios de un proveedor
  const saveChanges = async (supplierUuid) => {
    try {
      const dataToSave = {
        price: editData[supplierUuid].price !== "" ? parseFloat(editData[supplierUuid].price) : null,
        delivery_time: editData[supplierUuid].delivery_time !== "" ? parseInt(editData[supplierUuid].delivery_time) : null
      };
      
      if (dataToSave.price !== null && isNaN(dataToSave.price)) {
        setMessage({ text: "El precio debe ser un número válido", type: "error" });
        return;
      }
      
      if (dataToSave.delivery_time !== null && isNaN(dataToSave.delivery_time)) {
        setMessage({ text: "Los días de entrega deben ser un número válido", type: "error" });
        return;
      }

      await axios.patch(
        `${apiUrl}/products-supplier/${supplierUuid}/stock`, 
        dataToSave
      );
      
      // Actualizar el estado local
      setSuppliersData(prev => 
        prev.map(ps => 
          ps.uuid === supplierUuid
            ? { 
                ...ps, 
                current_price: dataToSave.price,
                current_delivery: dataToSave.delivery_time
              }
            : ps
        )
      );
      
      setMessage({ 
        text: "Cambios guardados con éxito", 
        type: "success" 
      });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.msg || "Error al guardar los cambios", 
        type: "error" 
      });
    }
  };

  // Eliminar proveedor del producto
  const deleteSupplier = async (supplierUuid) => {
    if (window.confirm("¿Estás seguro de quitar este proveedor del producto?")) {
      try {
        await axios.delete(
          `${apiUrl}/products-supplier/${supplierUuid}`
        );
        
        setSuppliersData(prev => prev.filter(ps => ps.uuid !== supplierUuid));
        
        setEditData(prev => {
          const newData = { ...prev };
          delete newData[supplierUuid];
          return newData;
        });
        
        setMessage({ 
          text: "Proveedor eliminado del producto", 
          type: "success" 
        });
      } catch (error) {
        setMessage({ 
          text: error.response?.data?.msg || "Error al eliminar el proveedor", 
          type: "error" 
        });
      }
    }
  };

  // Configuración de columnas para la tabla
  const columns = [
    { 
      header: "Proveedor", 
      accessor: "supplier_name",
      cell: (row) => (
        <span className="font-medium text-gray-800">
          {row.supplier_name}
        </span>
      )
    },
    { 
      header: "Precio", 
      accessor: "price",
      cell: (row) => (
        <div className="flex justify-center items-center">
          <input
            type="number"
            value={editData[row.uuid]?.price || ""}
            onChange={(e) => handleInputChange(row.uuid, 'price', e.target.value)}
            className="input"
            placeholder="Precio"
            step="0.01"
          />
        </div>
      )
    },
    { 
      header: "Días de entrega", 
      accessor: "delivery_time",
      cell: (row) => (
        <div className="flex justify-center items-center">
          <input
            type="number"
            value={editData[row.uuid]?.delivery_time || ""}
            onChange={(e) => handleInputChange(row.uuid, 'delivery_time', e.target.value)}
            className="input"
            placeholder="Días"
            min="0"
          />
        </div>
      )
    },
    { 
      header: "Acciones", 
      accessor: "acciones",
      width: "w-28"
    }
  ];

  const buttonsActions = (row) => (
    <div className="flex justify-center gap-4">      
      <button
        onClick={() => saveChanges(row.uuid)}
        className="btn-add bg-green-600 hover:bg-green-800 text-white font-medium rounded transition-colors duration-200"
        title="Guardar"
      >
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      <button
        onClick={() => deleteSupplier(row.uuid)}
        className="btn-add bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors duration-200"
        title="Eliminar proveedor"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
        </svg>
      </button>
    </div>
  );

  if (loading) return <Dashboard><div>Cargando...</div></Dashboard>;
  if (!suppliersData) return <Dashboard><div>Producto no encontrado</div></Dashboard>;
  return (
    <Dashboard title={`Precios por proveedor - ${productInfo.name}`}>
      {message.text && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`p-4 text-sm rounded-lg shadow-lg w-80 ${
            message.type === "success" 
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message.text}
          </div>
        </div>
      )}
      
      <Tabla
        columns={columns}
        data={suppliersData}
        buttonsActions={(row) => buttonsActions(row)}
        searchFields={['supplier_name']}
        onAdd={handleAddSupplier}
      />
    </Dashboard>
  );
}