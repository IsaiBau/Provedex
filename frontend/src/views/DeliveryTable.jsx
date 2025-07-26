import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Tabla from "../components/Tabla.jsx";
import Dashboard from "../Dashboard.jsx";

export default function DeliveryTable() {
  const [msg, setMsg] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/deliveries');
      if (!Array.isArray(response.data)) {
        throw new Error("La respuesta de la API no es un array válido");
      }
      const formattedDeliveries = formatDeliveries(response.data);
      setDeliveries(formattedDeliveries);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError(err.message || "Error al cargar las entregas");
    } finally {
      setLoading(false);
    }
  };

  const formatDeliveries = (deliveries) => {
    return deliveries.map(delivery => {
      // Formatear fecha y hora
      const timePart = delivery.delivery_time.split('T')[1].substring(0, 8);
      const fechaHora = `${delivery.delivery_date} ${timePart}`;
      
      // Crear descripción basada en el título o producto
      const descripcion = delivery.title || `Entrega de ${delivery.product?.name || 'producto'}`;
      
      return {
        ...delivery,
        descripcion,
        fecha_hora: fechaHora,
        producto_nombre: delivery.product?.name || '',
        supplier_nombre: delivery.supplier?.name || ''
      };
    });
  };

  // Función para eliminar entrega
// En la función deleteDelivery:
const deleteDelivery = async (uuid) => {
  if (window.confirm("¿Estás seguro de eliminar esta entrega?")) {
    try {
      await axios.delete(`http://localhost:5000/deliveries/${uuid}`);
      showSuccessMessage("Entrega eliminada con éxito");
      fetchDeliveries();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Error al eliminar");
    }
  }
};

  // Función para redirigir a añadir nueva entrega
  const handleAddDelivery = () => {
    navigate("/entregas");
  };

  // Función para editar entrega
  const handleEditDelivery = (uuid) => {
    navigate(`/entregas/${uuid}`);
  };

  // Columnas de la tabla
  const columns = [
    { 
        header: "Entregas", 
        accessor: "descripcion",
        cell: (row) => (
        <div className="max-w-xs truncate" title={row.descripcion}>
            {row.descripcion}
        </div>
        )
    },
    { 
        header: "Fecha y hora", 
        accessor: "fecha_hora",
        cell: (row) => (
        <span className="whitespace-nowrap flex justify-center">
            {row.fecha_hora}
        </span>
        )
    },
    { 
        header: "Estado", 
        accessor: "status",
        cell: (row) => (
            <span className={`status-badge flex justify-center ${
            row.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
            row.status === 'Completed' ? 'bg-green-100 text-green-800' :
            row.status === 'Rescheduled' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
            }`}>
            {row.status}
            </span>
        )
    },
    { 
        header: "Proveedor", 
        accessor: "supplier_nombre",
        cell: (row) => (
        <div className="max-w-xs truncate flex justify-center" title={row.supplier_nombre}>
            {row.supplier_nombre}
        </div>
        )
    },
    { 
        header: "Acciones", 
        accessor: "acciones",
        width: "w-28" // Ancho fijo para acciones
    },
    ];
const showSuccessMessage = (message) => {
  const messageContainer = document.getElementById('message-container');
  if (messageContainer) {
    messageContainer.innerHTML = `
      <div class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
        ${message}
      </div>
    `;
    setTimeout(() => {
      messageContainer.innerHTML = '';
    }, 3000);
  }
};

  // Botones de acciones para cada fila
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
  if (error) return <Dashboard><div className="text-red-500">Error: {error}</div></Dashboard>;

  return (
    <Dashboard title={"Entregas"}>
      {msg && (
        <div className={`p-4 mb-4 rounded ${msg.includes("éxito") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {msg}
        </div>
      )}
      
      <Tabla
        title={""}
        columns={columns}
        data={deliveries}
        buttonsActions={(row) => buttonsActions(row)}
        searchFields={['descripcion', 'producto_nombre', 'supplier_nombre', 'status']}
        onAdd={handleAddDelivery}
      />
    </Dashboard>
  );
}