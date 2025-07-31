import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Tabla from "../../components/Tabla.jsx";
import Dashboard from "../../Dashboard.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" }); // Estado unificado para mensajes
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      if (!Array.isArray(response.data)) {
        throw new Error("La respuesta de la API no es un array válido");
      }
      const formattedProducts = formatProducts(response.data);
      setProducts(formattedProducts);
    } catch (err) {
      showMessage(err.message || "Error al cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  };

const formatProducts = (products) => {
  return products.map(product => {
    // Manejo seguro de categoría (puede ser null)
    const categoryName = product.category?.name || 'Sin categoría';
    const color = product.category?.color || '#59189a';
    // Formatear proveedores y precios
    const suppliers = product.product_suppliers.map(ps => ({
      name: ps.supplier.name,
      price: ps.price,
      deliveryDays: ps.delivery_time
    }));
    
    // Encontrar el precio más bajo
    const lowestPrice = suppliers.length > 0 
      ? Math.min(...suppliers.map(s => s.price))
      : null;
    
    // Calcular estado de stock
    const stockStatus = 
      product.stock < product.min_stock ? 'CRÍTICO' :
      product.stock < product.min_stock * 1.5 ? 'BAJO' :
      'NORMAL';

    return {
      id: product.id,
      uuid: product.uuid,
      nombre: product.name,
      stock: product.stock,
      minStock: product.min_stock,
      maxStock: product.max_stock,
      categoria: categoryName,
      color: color,
      proveedores: suppliers,
      precioMasBajo: lowestPrice,
      estadoStock: stockStatus,
      necesitaReabastecimiento: product.stock < product.min_stock
    };
  });
};

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const deleteDelivery = async (uuid) => {
    if (window.confirm("¿Estás seguro de eliminar esta entrega?")) {
      try {
        await axios.delete(`http://localhost:5000/products/${uuid}`);
        showMessage("Entrega eliminada con éxito", "success");
        fetchDeliveries(); // Recargar la lista después de eliminar
      } catch (error) {
        showMessage(error.response?.data?.msg || "Error al eliminar", "error");
      }
    }
  };

  const handleAddDelivery = () => {
    navigate("/products-form");
  };

  const handleEditDelivery = (uuid) => {
    navigate(`/products-form/${uuid}`);
  };

  const columns = [
    { 
        header: "Productos", 
        accessor: "nombre",
        cell: (row) => (
        <div className="max-w-xs truncate" title={row.nombre}>
            {row.nombre}
        </div>
        )
    },
    { 
      header: "Categoría", 
      accessor: "categoria",
      cell: (row) => {
        const color = row.color || "#59189a"; // Usa row.color como valor por defecto
          return (
            <span 
              className="status-badge flex justify-center text-white rounded px-2 py-1 text-sm"
              style={{ backgroundColor: color }} // Aplica el color dinámico aquí
            >
              {row.categoria}
            </span>
          );
      }
    },
    { 
        header: "Stock minimo", 
        accessor: "stock_minimo",
        cell: (row) => (
        <span className="whitespace-nowrap flex justify-center">
            {row.minStock}
        </span>
        )
    },
    { 
        header: "Stock", 
        accessor: "stock",
        cell: (row) => (
            <span className={`status-badge flex justify-center ${
            row.stock < row.minStock ? 'bg-red-100 text-red-800' :
            row.stock > row.maxStock ? 'bg-green-100 text-green-800' :
            'bg-yellow-400 text-black'
            }`}>
            {row.stock}
            </span>
        )
    },
    { 
        header: "Stock máximo", 
        accessor: "stock_maximo",
        cell: (row) => (
        <span className="whitespace-nowrap flex justify-center">
            {row.maxStock}
        </span>
        )
    },
 {
    header: "Proveedor(es)", 
    accessor: "proveedores",
    cell: (row) => (
        <div className="flex flex-wrap gap-2 justify-center">
            {row.proveedores.map((proveedor, index) => (
                <div 
                    key={index} 
                    className="relative group inline-flex justify-center"
                >
                    {/* Badge del proveedor */}
                    <span className="status-badge bg-purple-200 text-purple-800 hover:bg-purple-300 transition-colors">
                        {proveedor.name}
                    </span>
                    
                    {/* Tooltip compacto */}
                    <div className="tooltip-padding absolute z-[9999] hidden group-hover:block w-auto min-w-[200px] bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-purple-100 text-center">
                            {/* Nombre del proveedor 
                            <h4 className="font-semibold text-purple-700 mb-2 text-sm">{proveedor.name}</h4>
                            */}
                            {/* Precio y entrega en una sola fila */}
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500">Precio:</span>
                                    <span className="font-medium text-purple-700">
                                        ${proveedor.price.toFixed(2)}
                                    </span>
                                </div>

                            </div>
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500">Entrega:</span>
                                    <span className="font-medium text-purple-700">
                                        {proveedor.deliveryDays}d
                                    </span>
                                </div>
                            </div>
                            {/* Indicador de mejor precio (si aplica) */}
                            {proveedor.price === row.precioMasBajo && (
                                <div className="mt-2">
                                    <span className="best-price-badge text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Mejor precio
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Flecha del tooltip */}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-purple-100 rotate-45"></div>
                    </div>
                </div>
            ))}
        </div>
    )
},
    { 
        header: "Acciones", 
        accessor: "acciones",
        width: "w-28"
    },
  ];

  const buttonsActions = (row) => (
    <div className="flex justify-center gap-4">
      <button
        onClick={() => handleEditDelivery(row.uuid)}
        className="btn-add bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded transition-colors duration-200"
        title="Editar"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
          <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
        </svg>
      </button>
      <button
        onClick={() => handleEditDelivery(row.uuid)}
        className="btn-add bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded transition-colors duration-200"
        title="Editar"
      >
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
  <path d="M21 16.5v-9a1 1 0 0 0-.553-.894l-8-4a1 1 0 0 0-.894 0l-8 4A1 1 0 0 0 3 7.5v9a1 1 0 0 0 .553.894l8 4a1 1 0 0 0 .894 0l8-4A1 1 0 0 0 21 16.5z"/>
</svg>


      </button>
      <button
        onClick={() => deleteDelivery(row.uuid)}
        className="btn-add bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors duration-200"
        title="Eliminar"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
        </svg>
      </button>
    </div>
  );

  if (loading) return <Dashboard><div>Cargando entregas...</div></Dashboard>;

  return (
    <Dashboard title={"Entregas"}>
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
        title={""}
        columns={columns}
        data={products}
        buttonsActions={(row) => buttonsActions(row)}
        searchFields={['nombre','categoria']}
        onAdd={handleAddDelivery}
      />
      
    </Dashboard>
  );
}