import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import AuthRoute from "./routes/AuthRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import SupplierRoute from "./routes/SupplierRoute.js";
import DeliveryRoute from "./routes/DeliveryRoute.js";
import TestRoute from "./routes/TestRoute.js";
import UserRoute from "./routes/UserRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
//MODELOS DE LA BD
import Categories from "./models/CategoryModel.js";
import DeliveryHistories from "./models/DeliveryHistoryModel.js";
import Deliveries from "./models/DeliveryModel.js";
import Products from "./models/ProductModel.js";
import ProductSupplier from "./models/ProductSupplierModel.js"
import Suppliers from "./models/SupplierModel.js";
import Users from "./models/UserModel.js";

dotenv.config();

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
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'file-name', 'file-size']
}))
app.use(express.json())
app.use(UserRoute);
app.use(ProductRoute);
app.use(SupplierRoute);
app.use(TestRoute);
app.use(DeliveryRoute);
app.use(AuthRoute);
app.use(CategoryRoute);

app.listen(process.env.APP_PORT, ()=>{
    console.log('Server encendido...')
});