import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
// import UserRoute from "./routes/UserRoute.js"
// import ProductRoute from "./routes/ProductRoute.js"
import TestRoute from "./routes/TestRoute.js"

dotenv.config();

const app = express();

(async()=>{
    await db.sync()
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
    origin: 'http://localhost:3000'
}))

// app.use(UserRoute);
// app.user(ProductRoute);
app.use(TestRoute);

app.use(express.json())

app.listen(process.env.APP_PORT, ()=>{
    console.log('Server encendido...')
});