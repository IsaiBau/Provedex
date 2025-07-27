import React from 'react';
import styles from '../assets/css/calendar.module.css';

const ModalStatus = ({
  show,
  onClose,
  currentStatus,
  onStatusChange,
  onUpdate
}) => {
  if (!show) return null;

  // Opciones para el select
  const statusOptions = [
    { value: 'Pending', label: 'Pendiente', color: 'bg-yellow-500' },
    { value: 'Canceled', label: 'Cancelado', color: 'bg-red-500' },
    { value: 'Rescheduled', label: 'Reprogramado', color: 'bg-blue-500' },
    { value: 'Completed', label: 'Completado', color: 'bg-green-500' },
    { value: 'Other', label: 'Otro', color: 'bg-gray-500' },
  ];

  // Encontrar la opción seleccionada actualmente
  const selectedOption = statusOptions.find(opt => opt.value === currentStatus) || statusOptions[0];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Actualizar estado de entrega</h3>
        
        {/* Select mejorado */}
        <div className="mt-4">
          <label htmlFor="status-select" className="block text-sm font-medium text-gray-900">
            Estado actual
          </label>
          
          <div className="relative mt-2">
            <select
              id="status-select"
              value={currentStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`${styles.statusSelect} appearance-none block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white`}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {/* Ícono personalizado */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Versión con estilos más avanzados (opcional) */}
          {/*
          <div className="mt-2 relative">
            <button 
              type="button" 
              className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-haspopup="listbox"
              aria-expanded="true"
              aria-labelledby="listbox-label"
            >
              <span className="flex items-center">
                <span className={`block h-3 w-3 rounded-full ${selectedOption.color}`} />
                <span className="ml-3 block truncate">{selectedOption.label}</span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {statusOptions.map((option) => (
                <li
                  key={option.value}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                  onClick={() => onStatusChange(option.value)}
                >
                  <div className="flex items-center">
                    <span className={`block h-3 w-3 rounded-full ${option.color}`} />
                    <span className="ml-3 block truncate font-normal">
                      {option.label}
                    </span>
                  </div>
                  
                  {option.value === currentStatus && (
                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          */}
        </div>

        <div className={styles.modalButtons}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onUpdate}>Actualizar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalStatus;