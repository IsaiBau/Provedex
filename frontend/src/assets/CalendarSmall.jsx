import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const eventColors = {
  Pending: "#4285F4",
  Canceled: "#EA4335",
  Rescheduled: "#FBBC05",
  Completed: "#34A853",
  default: "#673AB7",
};

const CalendarSmall = () => {
  const localizer = momentLocalizer(moment);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/deliveries');
      const deliveryEvents = transformDeliveriesToEvents(response.data || []);
      setEvents(deliveryEvents);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  const transformDeliveriesToEvents = (deliveries) => {
    return deliveries.filter(delivery => {
      if (!delivery?.delivery_date) return false;
      if (delivery.status === 'Completed') return false;
      return true;
    }).map(delivery => ({
      id: delivery.uuid,
      title: delivery.title,
      start: new Date(`${delivery.delivery_date}T00:00:00`),
      end: new Date(`${delivery.delivery_date}T00:00:00`),
      status: delivery.status,
    }));
  };

  const CustomToolbar = ({ label, onNavigate }) => {
    return (
      <div className="flex justify-between items-center mb-1">
        <button 
          className="text-xs p-0.5"
          onClick={() => onNavigate('PREV')}
        >
          &lt;
        </button>
        <span className="text-xs font-bold">{label}</span>
        <button 
          className="text-xs p-0.5"
          onClick={() => onNavigate('NEXT')}
        >
          &gt;
        </button>
      </div>
    );
  };

  const CustomDay = ({ date }) => {
    if (!date) return null;
    
    const dayNumber = date.getDate();
    const hasEvent = events.some(event => 
      moment(event.start).isSame(date, 'day')
    );

    return (
      <div className="rbc-day-bg relative h-full w-full flex items-center justify-center p-0">
        <span className={`text-[8px] ${hasEvent ? 'font-bold' : ''}`}>
          {dayNumber}
        </span>
        {hasEvent && (
          <div className="absolute bottom-0 right-0 w-1 h-1 rounded-full" 
               style={{ backgroundColor: eventColors.Pending }} />
        )}
      </div>
    );
  };

  useEffect(() => { fetchDeliveries(); }, []);

  if (loading) return (
    <div className="w-[200px] h-[200px] flex items-center justify-center">
      <div className="animate-pulse text-xs">Cargando...</div>
    </div>
  );

  return (
    <div className="w-[200px] h-[200px] overflow-hidden border rounded-lg p-1">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month']}
        date={currentDate}
        onNavigate={setCurrentDate}
        components={{
          toolbar: CustomToolbar,
          dateCellWrapper: CustomDay,
          header: ({ label }) => <div className="text-[8px] py-0.5">{label}</div>,
        }}
        style={{
          height: '100%',
          width: '100%',
        }}
      />
      <style>{`
        .rbc-calendar {
          font-size: 8px !important;
        }
        .rbc-month-view {
          height: calc(100% - 20px) !important;
          min-height: unset !important;
        }
        .rbc-month-row {
          min-height: 20px !important;
        }
        .rbc-month-header {
          height: 16px !important;
        }
        .rbc-header {
          padding: 0 !important;
          font-size: 8px !important;
        }
        .rbc-date-cell {
          padding: 0 !important;
          text-align: center !important;
          height: 100%;
        }
        .rbc-row-content {
          min-height: unset !important;
        }
        .rbc-day-bg {
          height: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarSmall;