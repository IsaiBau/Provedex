import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"; //esta es la libreria del calendario
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import styles from "../assets/css/calendar.module.css"
import StatusModal from '../components/ModalStatus'; 
import 'moment/locale/es'; // Importa los locales en español
moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
});

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
  Other: "#FF9800"      // Naranja
};
const messages = {
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  allDay: 'Todo el día',
  week: 'Semana',
  work_week: 'Semana laboral',
  day: 'Día',
  month: 'Mes',
  previous: 'Anterior',
  next: 'Siguiente',
  yesterday: 'Ayer',
  tomorrow: 'Mañana',
  today: 'Hoy',
  agenda: 'Agenda',
  noEventsInRange: 'No hay eventos en este rango.',
  showMore: total => `+ Ver más (${total})`
};
// Componente principal del calendario
const MyStyledCalendar = () => {
  const localizer = momentLocalizer(moment); //es parte de lo que pide el calendario, y se integra con moment.js esta importado arriba
  const [currentDate, setCurrentDate] = useState(new Date()); //obtiene fecha actual
  const [currentView, setCurrentView] = useState('month'); // Define que el calendario se vea en mes, y almacena la vista seleccionada, que si dia, semana, agenda
  const [events, setEvents] = useState([]);//estos son los eventos que salen en el calendario
  const [error, setError] = useState(null);//variable para mostrar errores
  const [loading, setLoading] = useState(true);//variable de carga de progreso
  const [editingEvent, setEditingEvent] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  
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

  const currentDate = new Date();

  return deliveries
    .filter(delivery => {
      if (!delivery || !delivery.delivery_date) return false;

      if (delivery.status === 'Completed') return false;

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
      const productName = delivery.product?.name || delivery.product_name || 'Producto no especificado';
      const supplierName = delivery.supplier?.name || delivery.provider_name || 'Proveedor no especificado';
      return {
        id: delivery.uuid,
        title: delivery.title,
        start: eventDate,
        end: eventDate,
        status: delivery.status,
        deliveryData: delivery,
        event_name:  `Entrega: ${productName} - ${supplierName}`, 
      };
    });
};

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };
 const handleEditStatus = (eventId) => {
    const eventToEdit = events.find(event => event.id === eventId);
    if (!eventToEdit) return;
    
    setEditingEvent(eventToEdit);
    setSelectedStatus(eventToEdit.status);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!editingEvent) return;

    try {
      const response = await axios.patch(
        `http://localhost:5000/deliveries/${editingEvent.id}/status`, 
        { status: selectedStatus }
      );

      if (response.data.msg === "Estado actualizado") {
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === editingEvent.id
              ? {
                  ...event,
                  status: selectedStatus,
                  deliveryData: {
                    ...event.deliveryData,
                    status: selectedStatus
                  }
                }
              : event
          )
        );
        setShowStatusModal(false);
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert(error.response?.data?.msg || 'Error al actualizar el estado');
    }
  };
  const changeYear = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + amount);
    setCurrentDate(newDate);
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
  /**
   * COMPONENTE DÍA PERSONALIZADO
   * Muestra indicadores visuales para días con eventos
   */
  const CustomEvent = ({ event }) => {
    return (
      <div style={{ padding: '2px text-sm' }}>
        <strong>{event.event_name || event.title}</strong>
      </div>
    );
  };

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
  <div className={styles.calendarContainer}>
    {/* Barra Lateral Izquierda */}
    <div className={styles.sidebarLeft}>
      <div className={styles.yearSelector}>
        <button onClick={() => changeYear(-1)}>&lt;</button>
        <h3 className={styles.yearTitle}>{currentDate.getFullYear()}</h3>
        <button onClick={() => changeYear(1)}>&gt;</button>
      </div>
      
      <ul className={styles.monthList}>
        {[...Array(12)].map((_, i) => (
          <li
            key={i}
            className={`${styles.monthItem} ${
              currentDate.getMonth() === i ? styles.active : ''
            }`}
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), i, 1))}
          >
            {moment().month(i).format("MMMM")}
          </li>
        ))}
      </ul>
    </div>

    {/* Calendario Principal */}
    <div className={styles.calendarMain}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day', 'agenda']}
        view={currentView}
        onView={setCurrentView}
        defaultView="month"
        date={currentDate}
        onNavigate={setCurrentDate}
        components={{ dateCellWrapper: CustomDay, event: CustomEvent }}
          messages={messages} 
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

    {/* Barra Lateral Derecha */}
    <div className={styles.sidebarRight}>
      <h3 className={styles.eventsTitle}>Próximas Entregas</h3>
      
      {loading ? (
        <div className={styles.loadingState}>Cargando entregas...</div>
      ) : error ? (
        <div className={styles.errorState}>Error: {error}</div>
      ) : (
        events
          .sort((a, b) => a.start - b.start)
          .map((event) => (
            <div 
              key={event.id}
              className={styles.eventCard}
              style={{ borderLeftColor: eventColors[event.status] || eventColors.default }}
            >
              <div className={styles.eventHeader}>
                <div 
                  className={styles.eventDot}
                  style={{ backgroundColor: eventColors[event.status] || eventColors.default }}
                />
                <div className={styles.eventDate}>
                  {moment(event.start).format("MMM D, YYYY")}
                </div>
              </div>
              
              <div className={styles.eventTime}>
                {moment(event.start).format("h:mm a")}
              </div>
              
              <div className={styles.eventTitle}>
                {event.title}
              </div>

              <div className={styles.eventDetail}>
                <strong>Estado:</strong> {traducirEstado(event.deliveryData.status)}
              </div>
              
              <div className={styles.eventDetail}>
                <strong>Producto:</strong> {event.deliveryData.product?.name || 'No especificado'}
              </div>
              
              <div className={styles.eventDetail}>
                <strong>Proveedor:</strong> {event.deliveryData.supplier?.name || 'No especificado'}
              </div>
              
              <div className={styles.eventActions}>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className={`${styles.eventButton} ${styles.hideButton}`}
                >
                  No mostrar
                </button>
                <button
                  onClick={() => handleEditStatus(event.id)}
                  className={`${styles.eventButton} ${styles.editButton}`}
                >
                  Editar estado
                </button>
              </div>
               {/* Modal como componente separado */}
              <StatusModal
                show={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                currentStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onUpdate={handleStatusUpdate}
              />
            </div>
          ))
      )}
    </div>
  </div>
);
};

export default MyStyledCalendar;