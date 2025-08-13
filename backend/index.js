import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import https from "https";
import http from "http";
import fs from "fs";
import db from "./config/Database.js";
import AuthRoute from "./routes/AuthRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import SupplierRoute from "./routes/SupplierRoute.js";
import DeliveryRoute from "./routes/DeliveryRoute.js";
import TestRoute from "./routes/TestRoute.js";
import UserRoute from "./routes/UserRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import RecoveryPassRoute from "./routes/RecoveryPassRoute.js";
import ProductSupplerRoute from "./routes/ProductSuplierRoute.js";
import NotificationRoute from "./routes/NotificationRoute.js";
//MODELOS DE LA BD
import Categories from "./models/CategoryModel.js";
import DeliveryHistories from "./models/DeliveryHistoryModel.js";
import Deliveries from "./models/DeliveryModel.js";
import Products from "./models/ProductModel.js";
import ProductSupplier from "./models/ProductSupplierModel.js"
import Suppliers from "./models/SupplierModel.js";
import Notification from "./models/NotificationModel.js";
import Users from "./models/UserModel.js";
import webpush from "web-push";
import TestPush from "./routes/TestPush.js";
import cron from "node-cron";
import { checkDeliveriesAndNotify, sendEmailReminders } from "./controllers/Notification.js";

dotenv.config();

webpush.setVapidDetails(
  `mailto:${process.env.EMAIL_USER}`,
  process.env.VAPID_PUBLIC_KEY, 
  process.env.VAPID_PRIVATE_KEY 
);

const app = express();

(async()=>{
    await db.sync()// colocar entre los parentesis {force:true} en caso de querer rehacer la bd, se eliminaran todos los datos
})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto',    
    }
}));

app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://localhost:5173'], //colocar origin: true
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'file-name', 'file-size']
}))
app.use(express.json())
app.use(UserRoute);
app.use(ProductRoute);
app.use(SupplierRoute);
app.use(TestPush);
app.use(TestRoute);
app.use(DeliveryRoute);
app.use(AuthRoute);
app.use(CategoryRoute);
app.use(RecoveryPassRoute);
app.use(ProductSupplerRoute);
app.use(NotificationRoute);

const sslOptions = https.createServer({
    key: fs.readFileSync("./certs/localhost+3-key.pem"),
    cert: fs.readFileSync("./certs/localhost+3.pem")
}, app);

https.createServer(sslOptions, app).listen(process.env.APP_PORT, () => { //colocar 0.0.0.0 despues de app_port
    console.log(`Servidor HTTPS corriendo en puerto ${process.env.APP_PORT}`);
});

http.createServer((req, res) => {
    const host = req.headers.host.replace(/:\d+$/, `:${process.env.APP_PORT}`);
    res.writeHead(301, { Location: `https://${host}${req.url}` });
    res.end();
}).listen(80, () => {
    console.log("Redireccionando HTTP a HTTPS...");
});
//*/10
cron.schedule("*/10 * * * *", async () => {
  console.log("verificando entregas...");
  await checkDeliveriesAndNotify();
  //await sendEmailReminders();
});