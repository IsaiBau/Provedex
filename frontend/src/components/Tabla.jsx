import React, { useState, useEffect } from "react";
import { Buscador } from "../components/Buscador";
import { useSelector } from "react-redux";

const Tabla = ({ 
  showButtonAdd = true, 
  columns, 
  title, 
  buttonsActions, 
  data, 
  searchFields = [], 
  onAdd 
}) => {
  const {user} = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  
  useEffect(() => {
    const normalizedTerm = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    setFilteredData(
      data.filter(item =>
        searchFields.some(field => {
          if (item[field]) {
            if (typeof item[field] === 'string') {
              const normalizedValue = item[field].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
              return normalizedValue.includes(normalizedTerm);
            } else if (typeof item[field] === 'number') {
              const stringValue = item[field].toString().toLowerCase();
              return stringValue.includes(normalizedTerm);
            }
          }
          return false;
        })
      )
    );
  }, [searchTerm, data, searchFields]);

return (
  <div className="px-6 mt-6 w-full">
    {/* Mensajes de estado */}
    <div id="message-container" className="mb-6"></div>
    
    <div className="bg-white overflow-hidden">
      <div className="p-4 border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800 uppercase">
            {title}
          </h2>
          <div className="table-header-actions">
            {showButtonAdd && onAdd && (
              <button 
                onClick={onAdd} 
                className="btn-add bg-purple-700 hover:bg-purple-900 text-white font-medium rounded transition-colors duration-200"
                title="Añadir entrega"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/>
                </svg>
                <span>Añadir</span>
              </button>
            )}
            <div className="search-container">
              <Buscador onSearch={setSearchTerm} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="table-container relative overflow-x-auto p-2">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-700 uppercase bg-purple-100">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`${col.width} ${col.padding} text-center`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr 
                key={row.uuid || rowIndex} 
                className="bg-white border-b hover:bg-purple-100 "
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`${
                      col.accessor === "role" ? "capitalize" : ""
                    }`}
                  >
                    {col.accessor === "acciones"
                      ? buttonsActions(row)
                      : typeof col.cell === 'function'
                        ? col.cell(row)
                        : typeof col.accessor === 'function'
                          ? col.accessor(row)
                          : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default Tabla;