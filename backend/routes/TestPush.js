import webpush from "web-push";
import express from "express";
import Notification  from "../models/NotificationModel.js"; // ajusta según tu estructura

const router = express.Router();

router.post("/test-push", async (req, res) => {
  try {
    const subscriptions = await Notification.findAll(); // o filtra por usuario si quieres

    if (subscriptions.length === 0) {
      return res.status(404).json({ message: "No hay suscripciones" });
    }

    const payload = JSON.stringify({
      title: "Entrega programada de Computadora",
      body: "Tu pedido llegará mañana a las 10:00 AM"
    });

    for (const sub of subscriptions) {
      const parsedKeys = JSON.parse(sub.keys);
      const Notification = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: parsedKeys.p256dh,
          auth: parsedKeys.auth
        }
      };

      await webpush.sendNotification(Notification, payload);
    }

    res.status(200).json({ message: "Notificación enviada" });
  } catch (err) {
    console.error("Error al enviar push:", err);
    res.status(500).json({ error: "Error al enviar notificación" });
  }
});

export default router;
