import webpush from "web-push";
import Deliveries from "../models/DeliveryModel.js";
import PushSubscription from "../models/NotificationModel.js";
import { Op } from "sequelize";
import Products from "../models/ProductModel.js";
import Suppliers from "../models/SupplierModel.js";
import transporter from "../config/MailConfig.js";
import https from 'https';
import { Agent } from 'https';

function formatTime(date) {
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function formatTimeFromSequelizeTime(timeValue) {
  if (typeof timeValue === "object" && timeValue instanceof Date) {

    const hours = timeValue.getUTCHours().toString().padStart(2, "0");
    const minutes = timeValue.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  if (typeof timeValue === "string") {
    return timeValue.substring(0, 5); 
  }

  return String(timeValue); 
}

function formatTimeRange(baseTime, offsetMinutes) {
  const adjusted = new Date(baseTime.getTime() - offsetMinutes * 60 * 1000);
  return adjusted.toTimeString().split(" ")[0].slice(0, 5);
}

function formatTimeLocal(date) {
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Mexico_City"
  });
}
function formatDateFromSequelizeDate(dateValue) {
  if (typeof dateValue === "object" && dateValue instanceof Date) {
    const year = dateValue.getFullYear();
    const month = (dateValue.getMonth() + 1).toString().padStart(2, "0");
    const day = dateValue.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  if (typeof dateValue === "string") {
    return dateValue.substring(0, 10); 
  }

  return String(dateValue);
}

function roundToHour(date) {
  date.setMinutes(0, 0, 0);
  return date;
}
export async function checkDeliveriesAndNotify() {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const lowerBoundTime = new Date(oneHourLater.getTime() - 10 * 60 * 1000);
  const upperBoundTime = new Date(oneHourLater.getTime() + 10 * 60 * 1000);
  const lowerBound = formatTimeLocal(lowerBoundTime);
  const upperBound = formatTimeLocal(upperBoundTime);
  const today = now.toLocaleDateString("sv-SE"); 
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("sv-SE");

  console.log("Hora actual:", now.toLocaleString("es-MX", { timeZone: "America/Mexico_City" }));
  console.log("Buscando entregas entre:", lowerBound, "y", upperBound);
  console.log("Fechas buscadas:", formatDateFromSequelizeDate(now), formatDateFromSequelizeDate(tomorrow));
  const deliveries = await Deliveries.findAll({
    where: {
      delivery_date: {
        [Op.in]: [formatDateFromSequelizeDate(tomorrow), formatDateFromSequelizeDate(now)]
      },
      delivery_time: {
        [Op.between]: [lowerBound, upperBound]
        }

    },
    include: [
        {
            model: Products,
            attributes: ["name"]
        },
        {
            model: Suppliers,
            attributes: ["name"]
        }
    ]
  });

  const subs = await PushSubscription.findAll();

  for (const delivery of deliveries) {
    const horaFormateada = formatTimeFromSequelizeTime(delivery.delivery_time);
    const fechaFormateada = delivery.getDataValue("delivery_date");

    for (const sub of subs) {
        const parsedKeys = JSON.parse(sub.keys);
        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: parsedKeys
        };

        await webpush.sendNotification(pushSubscription , JSON.stringify({
            title: `Entrega próxima de ${delivery.product.name}-${delivery.supplier.name}`,
            body: `Tu entrega será el ${fechaFormateada} a las ${horaFormateada}`
        }));
    }
  }
}

export async function saveSubscription(req, res) {
  try {
    const { endpoint, keys } = req.body;

    const exists = await PushSubscription.findOne({ where: { endpoint } });

    if (exists) {
      console.log("Suscripción ya existe:", endpoint);
      return res.status(200).json({ message: "Ya estás suscrito" });
    }

    await PushSubscription.create({
      endpoint,
      keys: JSON.stringify(keys)
    });

    console.log("Suscripción guardada:", endpoint);
    res.status(201).json({ message: "Suscripción guardada" });
  } catch (error) {
    console.error("Error al guardar suscripción:", error);
    res.status(500).json({ error: "Error al guardar suscripción" });
  }
}

export async function sendEmailReminders() {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const lowerBoundTime = new Date(oneHourLater.getTime() - 10 * 60 * 1000);
  const upperBoundTime = new Date(oneHourLater.getTime() + 10 * 60 * 1000);
  const lowerBound = formatTimeLocal(lowerBoundTime);
  const upperBound = formatTimeLocal(upperBoundTime);
  const today = now.toLocaleDateString("sv-SE"); 
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("sv-SE");
  const httpsAgent = new Agent({
    rejectUnauthorized: false
  });

 try {

    const deliveries = await Deliveries.findAll({
      where: {
        delivery_date: {
          [Op.in]: [today, tomorrow]
        },
        delivery_time: {
          [Op.between]: [lowerBound, upperBound]
        }
      },
      include: [
        { model: Products, attributes: ["name"] },
        { model: Suppliers, attributes: ["name"] }
      ]
    });

    if (deliveries.length === 0) {
      console.log("No hay entregas próximas para notificar");
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'scjc320@gmail.com',
      subject: `Recordatorio de ${deliveries.length} entregas próximas`,
      html: `
        <h2>Recordatorio de entregas</h2>
        <p>Tienes ${deliveries.length} entregas programadas:</p>
        <ul>
          ${deliveries.map(delivery => {
            const horaFormateada = formatTimeFromSequelizeTime(delivery.delivery_time);
            const fechaFormateada = formatDateFromSequelizeDate(delivery.delivery_date);
            
            return `
              <li>
                <strong>${delivery.product.name}</strong> de ${delivery.supplier.name}<br>
                Fecha: ${fechaFormateada}<br>
                Hora: ${horaFormateada}
              </li>
            `;
          }).join('')}
        </ul>
        <p>¡Prepárate para recibirlas!</p>
      `
    };

    // 4. Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a scjc320@gmail.com con ${deliveries.length} recordatorios`);

  } catch (error) {
    console.error("Error en sendEmailReminders:", error);
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    }
  }
}