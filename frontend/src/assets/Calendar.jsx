import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"; //esta es la libreria del calendario
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

/*
 * PALETA DE COLORES PARA EVENTOS
 * Define colores específicos para cada tipo de evento
 * Esto ayuda a visualizar rápidamente el tipo de evento en el calendario
 */
// Colores para diferentes tipos de eventos
const eventColors = {
  Pending: "#4285F4", // Azul
  Canceled: "#EA4335",     // Rojo
  Rescheduled: "#FBBC05",   // Amarillo
  Completed: "#34A853", // Verde
  default: "#673AB7",     // Morado
  //Other: "#FF9800"      // Naranja
};
// Componente principal del calendario
const MyStyledCalendar = () => {
  const localizer = momentLocalizer(moment); //es parte de lo que pide el calendario, y se integra con moment.js esta importado arriba
  const [currentDate, setCurrentDate] = useState(new Date()); //obtiene fecha actual
  const [currentView, setCurrentView] = useState('month'); // Define que el calendario se vea en mes, y almacena la vista seleccionada, que si dia, semana, agenda
  const [events, setEvents] = useState([]);//estos son los eventos que salen en el calendario
  const [error, setError] = useState(null);//variable para mostrar errores
  const [loading, setLoading] = useState(true);//variable de carga de progreso
   // Función para obtener entregas desde tu API
  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/deliveries');
      if (!Array.isArray(response.data)) {
        throw new Error("La respuesta de la API no es un array válido");
      }
      const deliveryEvents = transformDeliveriesToEvents(response.data);
      setEvents(deliveryEvents);
      console.log(events)
      console.log(deliveryEvents)
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError(err.message || "Error al cargar las entregas");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDeliveries();
  }, []);
  useEffect(() => {
  console.log("Estado actualizado de events:", events);
}, [events]); // 
  //transformar las entregas a eventos
const transformDeliveriesToEvents = (deliveries) => {
  if (!Array.isArray(deliveries)) return [];
  
  const currentDate = new Date(); // Fecha actual para comparación

  return deliveries
    .filter(delivery => {
      if (!delivery || !delivery.delivery_date) return false;
      
      // Filtra completadas
      if (delivery.status === 'Completed') return false;
      
      // Filtra entregas pasadas (excepto pendientes y reagendadas)
      const deliveryDate = new Date(`${delivery.delivery_date}T${delivery.delivery_time.split('T')[1]}`);
      const isPastDelivery = deliveryDate < currentDate;
      
      if (isPastDelivery && delivery.status !== 'Pending' && delivery.status !== 'Rescheduled') {
        return false;
      }
      
      return true;
    })
    .map(delivery => {
      const timePart = delivery.delivery_time.split('T')[1];
      const time = timePart.substring(0, 8);
      const eventDate = new Date(`${delivery.delivery_date}T${time}`);
      
      return {
        id: delivery.uuid,
        title: delivery.title,
        start: eventDate,
        end: eventDate,
        status: delivery.status,
        deliveryData: delivery
      };
    });
};
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const changeYear = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + amount);
    setCurrentDate(newDate);
  };

  /**
   * COMPONENTE DÍA PERSONALIZADO
   * Muestra indicadores visuales para días con eventos
   */
  const CustomDay = ({ date }) => {
  if (!date) return <div></div>;
  
  const dayNumber = date.getDate();
  // Comparación directa con las fechas de los eventos
  const hasEvent = events.some(event => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  if (!hasEvent) return <div className="p-2">{dayNumber}</div>;
  
  // Obtiene estados únicos de los eventos de este día
  const eventStatuses = [...new Set(
    events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    }).map(event => event.status)
  )];

  return (
    <div className="relative h-full">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-0.5">
        {eventStatuses.map((status, i) => (
          <div 
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: eventColors[status] || eventColors.default }}
          />
        ))}
      </div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 ${
        hasEvent ? 'text-transparent' : 'text-inherit'
      }`}>
        {dayNumber}
      </div>
    </div>
  );
};
  // Renderizado principal del componente
   return (
    <div className="flex h-screen font-sans">
      {/* Barra Lateral Izquierda */}
      <div className="w-48 p-5 bg-gray-800 text-white">
        <div className="flex items-center justify-between mb-5">
          <button 
            onClick={() => changeYear(-1)}
            className="bg-transparent border-none cursor-pointer text-white text-lg"
          >
            &lt;
          </button>
          <h3 className="m-0 text-xl">
            {currentDate.getFullYear()}
          </h3>
          <button 
            onClick={() => changeYear(1)}
            className="bg-transparent border-none cursor-pointer text-white text-lg"
          >
            &gt;
          </button>
        </div>
        
        <ul className="list-none p-0 m-0">
          {[...Array(12)].map((_, i) => (
            <li
              key={i}
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), i, 1))}
              className={`py-2.5 cursor-pointer transition-all duration-200 ${
                currentDate.getMonth() === i ? 'font-bold' : 'font-normal'
              } hover:text-blue-200 hover:bg-opacity-10`}
            >
              {moment().month(i).format("MMMM")}
            </li>
          ))}
        </ul>
      </div>

      {/* Calendario Principal */}
      <div className="flex-1 p-5 bg-gray-50">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day', 'agenda']}
          view={currentView}
          onView={setCurrentView}
          defaultView="month"
          className="h-full"
          date={currentDate}
          onNavigate={setCurrentDate}
          components={{ dateCellWrapper: CustomDay }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: eventColors[event.status] || eventColors.default,
              borderRadius: '4px',
              color: 'white',
              border: '0px',
              display: 'block',
              cursor: 'default',
            }
          })}
        />
      </div>

      {/* Barra Lateral Derecha - Eventos */}
      <div className="w-80 p-5 bg-white shadow-lg overflow-y-auto">
        <h3 className="mt-0 text-gray-800 text-xl border-b border-gray-200 pb-2.5">
          Próximas Entregas
        </h3>
        
        {loading ? (
          <div>Cargando entregas...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          events
            .sort((a, b) => a.start - b.start)
            .map((event) => (
              <div 
                key={event.id}
                className="mb-4 p-4 bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                style={{ borderLeft: `4px solid ${eventColors[event.status] || eventColors.default}` }}
              >
                <div className="flex items-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2.5"
                    style={{ backgroundColor: eventColors[event.status] || eventColors.default }}
                  />
                  <div className="font-semibold text-gray-800 text-sm">
                    {moment(event.start).format("MMM D, YYYY")}
                  </div>
                </div>
                
                <div className="text-gray-600 mb-2 text-sm">
                  {moment(event.start).format("h:mm a")} 
                </div>
                
                <div className="mb-3 text-gray-800">
                  {event.title}
                </div>

                <div className="mb-2">
                  <strong>Estado:</strong> {event.deliveryData.status}
                </div>
                
                <div className="mb-2">
                  <strong>Producto:</strong> {event.deliveryData.product?.name || 'No especificado'}s
                </div>
                
                <div className="mb-3">
                  <strong>Producto:</strong> {event.deliveryData.supplier?.name || 'No especificado'}
                </div>
                
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="flex-1 bg-transparent border border-red-500 text-red-500 py-1 px-3 rounded text-sm 
                    cursor-pointer transition-all duration-200 hover:bg-red-500 hover:text-white
                    whitespace-nowrap"
                  >No mostrar</button>
                  <button
                    onClick={() => handleEditStatus(event.id)}
                    className="flex-1 bg-transparent border border-yellow-500 text-yellow-600 py-1 px-3 rounded text-sm 
                    cursor-pointer transition-all duration-200 hover:bg-yellow-500 hover:text-white
                    whitespace-nowrap"
                  >Editar estado</button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MyStyledCalendar;