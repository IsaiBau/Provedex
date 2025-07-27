import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Tabla from "../components/Tabla.jsx";
import Dashboard from "../Dashboard.jsx";

export default function DeliveryTable() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" }); // Estado unificado para mensajes
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
      showMessage(err.message || "Error al cargar las entregas", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDeliveries = (deliveries) => {
    return deliveries.map(delivery => {
      const timePart = delivery.delivery_time.split('T')[1].substring(0, 8);
      const fechaHora = `${delivery.delivery_date} ${timePart}`;
      
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

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const deleteDelivery = async (uuid) => {
    if (window.confirm("¿Estás seguro de eliminar esta entrega?")) {
      try {
        await axios.delete(`http://localhost:5000/deliveries/${uuid}`);
        showMessage("Entrega eliminada con éxito", "success");
        fetchDeliveries(); // Recargar la lista después de eliminar
      } catch (error) {
        showMessage(error.response?.data?.msg || "Error al eliminar", "error");
      }
    }
  };

  const handleAddDelivery = () => {
    navigate("/entregas");
  };

  const handleEditDelivery = (uuid) => {
    navigate(`/entregas/${uuid}`);
  };
const traducirEstado = (estado) => {
  switch (estado) {
    case "Pending":
      return "Pendiente";
    case "Canceled":
      return "Cancelado";
    case "Rescheduled":
      return "Reprogramado";
    case "Completed":
      return "Completado";
    default:
      return "Otro";
  }
};
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
            {traducirEstado(row.status)}
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
        data={deliveries}
        buttonsActions={(row) => buttonsActions(row)}
        searchFields={['descripcion', 'producto_nombre', 'supplier_nombre', 'status']}
        onAdd={handleAddDelivery}
      />
      
    </Dashboard>
  );
}