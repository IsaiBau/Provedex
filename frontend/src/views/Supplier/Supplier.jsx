import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Tabla from "../../components/Tabla.jsx";
import Dashboard from "../../Dashboard.jsx";

export default function SuppliersTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/suppliers`);
      if (!Array.isArray(response.data)) {
        throw new Error("La respuesta de la API no es un array válido");
      }
      setSuppliers(response.data);
    } catch (err) {
      showMessage(err.message || "Error al cargar los proveedores", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const deleteSupplier = async (uuid) => {
    if (window.confirm("¿Estás seguro de eliminar este proveedor?")) {
      try {
        await axios.delete(`${apiUrl}/suppliers/${uuid}`);
        showMessage("Proveedor eliminado con éxito", "success");
        fetchSuppliers();
      } catch (error) {
        showMessage(error.response?.data?.msg || "Error al eliminar", "error");
      }
    }
  };

  const handleAddSupplier = () => {
    navigate("/proveedores/form");
  };

  const handleEditSupplier = (uuid) => {
    navigate(`/proveedores/form/${uuid}`);
  };

  const columns = [
    {
      header: "Nombre",
      accessor: "name",
      cell: (row) => <div className="text-left">{row.name}</div>,
    },
    {
      header: "Teléfono",
      accessor: "phone",
      cell: (row) => <div className="text-center">{row.phone || "-"}</div>,
    },
    {
      header: "Representante",
      accessor: "representative",
      cell: (row) => (
        <div className="text-center">{row.representative || "-"}</div>
      ),
    },
    {
      header: "Acciones",
      accessor: "acciones",
      width: "w-28",
    },
  ];

  const buttonsActions = (row) => (
    <div className="flex justify-center gap-4">
      <button
        onClick={() => handleEditSupplier(row.uuid)}
        className="btn-add bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded transition-colors duration-200"
        title="Editar"
      >
        ✏️
      </button>
      <button
        onClick={() => deleteSupplier(row.uuid)}
        className="btn-add bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors duration-200"
        title="Eliminar"
      >
        🗑️
      </button>
    </div>
  );

  if (loading) return <Dashboard><div>Cargando proveedores...</div></Dashboard>;

  return (
    <Dashboard title={"Proveedores"}>
      {message.text && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`p-4 text-sm rounded-lg shadow-lg w-80 ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <Tabla
        title={""}
        columns={columns}
        data={suppliers}
        buttonsActions={buttonsActions}
        searchFields={["name", "phone", "representative"]}
        onAdd={handleAddSupplier}
      />
    </Dashboard>
  );
}
