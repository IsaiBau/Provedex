import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"; //esta es la libreria del calendario
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

/*
 * PALETA DE COLORES PARA EVENTOS
 * Define colores específicos para cada tipo de evento
 * Esto ayuda a visualizar rápidamente el tipo de evento en el calendario
 */
// Colores para diferentes tipos de eventos
const eventColors = {
  conference: "#4285F4", // Azul
  dinner: "#EA4335",     // Rojo
  congress: "#FBBC05",   // Amarillo
  competition: "#34A853", // Verde
  family: "#673AB7",     // Morado
  sports: "#FF9800"      // Naranja
};
// Componente principal del calendario
const MyStyledCalendar = () => {
  const localizer = momentLocalizer(moment); //es parte de lo que pide el calendario, y se integra con moment.js esta importado arriba
  const [currentDate, setCurrentDate] = useState(new Date()); //obtiene fecha actual
  const [currentView, setCurrentView] = useState('month'); // Define que el calendario se vea en mes, y almacena la vista seleccionada, que si dia, semana, agenda
  const [events, setEvents] = useState([ //estos son los eventos que salen en el calendario
    {
      id: 1,
      title: "Computer conference",
      start: new Date(2025, 6, 3, 17, 0),
      end: new Date(2025, 6, 3, 19, 0),
      type: "conference"
    },
    {
      id: 2,
      title: "A very important dinner with Anna",
      start: new Date(2025, 6, 3, 17, 0),
      end: new Date(2025, 6, 3, 19, 0),
      type: "dinner"
    },
    {
      id: 3,
      title: "Product Design Congress",
      start: new Date(2025, 6, 12, 10, 0),
      end: new Date(2025, 6, 12, 12, 0),
      type: "congress"
    },
    {
      id: 4,
      title: "Design Competition Submission",
      start: new Date(2025, 6, 17, 9, 30),
      end: new Date(2025, 6, 17, 11, 30),
      type: "competition"
    },
    {
      id: 5,
      title: "Go fishing with family",
      start: new Date(2025, 6, 22, 11, 30),
      end: new Date(2025, 6, 22, 15, 30),
      type: "family"
    },
    {
      id: 6,
      title: "Playing basketball with George",
      start: new Date(2025, 6, 26, 13, 30),
      end: new Date(2025, 6, 26, 15, 30),
      type: "sports"
    },
      {
      id: 7,
      title: "Comer",
      start: new Date(2025, 6, 26, 13, 30),
      end: new Date(2025, 6, 26, 15, 30),
      type: "sports"
    },
     {
      id: 7,
      title: "Comer",
      start: new Date(2025, 6, 26, 13, 30),
      end: new Date(2025, 6, 26, 15, 30),
      type: "sports"
    },
     {
      id: 7,
      title: "Comer",
      start: new Date(2025, 6, 26, 13, 30),
      end: new Date(2025, 6, 26, 15, 30),
      type: "sports"
    },
  ]);
  /**
   * ELIMINAR EVENTO DE LA PARTE DERECHA DONDE DICE PROXIMOS EVENTOS
   * @param {number} eventId - ID del evento a eliminar
   * Filtra la lista de eventos para remover el especificado
   */
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };
 /**
   * CAMBIAR AÑO
   * Es para cambiar de año en la parte superior izquierda con las flechitas que aparecen a los lados del año
   * @param {number} amount - Cantidad de años a avanzar/retroceder (1 o -1)
   * Actualiza la fecha actual sumando/restando años
   */
  const changeYear = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + amount);
    setCurrentDate(newDate);
  };

  /**
   * ESTILO PARA EVENTOS
   * Asigna colores y estilos basados en el tipo de evento
   */
  const eventStyleGetter = (event) => {
    const backgroundColor = eventColors[event.type] || '#4285F4';// Color por defecto azul
    return {
      style: {
        backgroundColor, // Color según tipo de evento
        borderRadius: '4px', // Bordes redondeados
        color: 'white', // Texto blanco
        border: '0px', // Sin borde
        display: 'block' // Mostrar como bloque
      }
    };
  };

 
  /**
   * COMPONENTE DÍA PERSONALIZADO
   * Muestra indicadores visuales para días con eventos
   */
  const CustomDay = ({ date }) => {
   if (!date) return <div></div>; // Validación para fecha undefined
  
   const dayNumber = date.getDate(); // Número del día (1-31)
    const hasEvent = events.some(e => moment(e.start).isSame(date, 'day')); // Verifica si hay eventos

   // Si no hay eventos, muestra solo el número del día
    if (!hasEvent) return <div style={{ padding: '8px' }}>{dayNumber}</div>;
    
    // Obtiene tipos únicos de eventos para este día
    const eventTypes = [...new Set(
      events.filter(e => moment(e.start).isSame(date, 'day'))
        .map(e => e.type)
    )];
      // Renderiza el día con indicadores de eventos
    return (
      <div style={{ position: "relative", height: "100%" }}>
        {/* Contenedor de puntos indicadores */}
        <div style={{ 
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: "2px"
        }}>
          {eventTypes.map((type, i) => (
            <div key={i} style={{
              backgroundColor: eventColors[type], // Color según tipo de evento
              borderRadius: "50%", // Forma circular
              width: "12px",
              height: "12px"
            }} />
          ))}
        </div>
        {/* Número del día (transparente si hay eventos) */}
        <div style={{ 
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: hasEvent ? "transparent" : "inherit",
          zIndex: 1
        }}>
          {date.getDate()}
        </div>
      </div>
    );
  };

  // Renderizado principal del componente
  return (
    <div style={{ 
      display: "flex", 
      height: "100vh",
      fontFamily: "'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Barra Lateral Izquierda */}
      <div style={{ 
        width: "180px", 
        padding: "20px", 
        background: "#2c3e50",
        color: "white"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          marginBottom: "20px"
        }}>
            {/* Botón año siguiente */}
          <button 
            onClick={() => changeYear(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontSize: "18px"
            }}
          >
            &lt;
          </button>
          <h3 style={{ margin: "0", fontSize: "1.5rem" }}>
            {currentDate.getFullYear()}
          </h3>
          <button 
            onClick={() => changeYear(1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontSize: "18px"
            }}
          >
            &gt;
          </button>
        </div>
         {/* Lista de meses */}
        <ul style={{ 
          listStyle: "none", 
          padding: 0,
          margin: 0
        }}>
          {[...Array(12)].map((_, i) => (
            <li
              key={i}
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), i, 1))}
              style={{
                padding: "10px 0",
                cursor: "pointer",
                fontWeight: currentDate.getMonth() === i ? "bold" : "normal",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s ease",
                ":hover": {
                  background: "rgba(255,255,255,0.1)"
                }
              }}
            >
              {moment().month(i).format("MMMM")}
            </li>
          ))}
        </ul>
      </div>

      {/* Calendario Principal */}
      <div style={{ 
        flex: 1, 
        padding: "20px",
        background: "#f9f9f9"
      }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day', 'agenda']} // Habilita todas las vistas
          view={currentView} // Cambiar vista
          onView={setCurrentView}
          defaultView="month"
          style={{ height: "100%" }}
          date={currentDate}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          components={{
            dateCellWrapper: CustomDay
          }} // Componente personalizado para días
          eventPropGetter={eventStyleGetter} // Estilos para eventos
        />
      </div>

      {/* Barra Lateral Derecha - Eventos */}
      <div style={{ 
        width: "320px", 
        padding: "20px", 
        background: "white",
        boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
        overflowY: "auto"
      }}>
        <h3 style={{ 
          marginTop: 0, 
          color: "#2c3e50",
          fontSize: "1.3rem",
          borderBottom: "2px solid #eee",
          paddingBottom: "10px"
        }}>
          Próximos Eventos
        </h3>
        
        {events
          .sort((a, b) => a.start - b.start)
          .map((event) => (
            <div 
              key={event.id}
              style={{
                marginBottom: "15px",
                padding: "15px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                borderLeft: `4px solid ${eventColors[event.type]}`,
                transition: "all 0.2s ease",
                ":hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }
              }}
            >
              <div style={{ 
                display: "flex",
                alignItems: "center",
                marginBottom: "8px"
              }}>
                <div style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: eventColors[event.type],
                  marginRight: "10px"
                }} />
                <div style={{ 
                  fontWeight: "600", 
                  color: "#2c3e50",
                  fontSize: "0.95rem"
                }}>
                  {moment(event.start).format("MMM D, YYYY")}
                </div>
              </div>
              
              <div style={{ 
                color: "#666", 
                marginBottom: "8px",
                fontSize: "0.85rem"
              }}>
                {moment(event.start).format("h:mm a")} - {moment(event.end).format("h:mm a")}
              </div>
              
              <div style={{ 
                marginBottom: "12px",
                color: "#333",
                fontSize: "1rem"
              }}>
                {event.title}
              </div>
              
              <button
                onClick={() => handleDeleteEvent(event.id)}
                style={{
                  background: "none",
                  border: "1px solid #ff4444",
                  color: "#ff4444",
                  padding: "5px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  transition: "all 0.2s ease",
                  ":hover": {
                    background: "#ff4444",
                    color: "white"
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyStyledCalendar;