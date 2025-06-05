import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import projectRouter from "./routes/project.route.js"
import requesterRouter from "./routes/requester.route.js"
import connectDB from './utils/db.js';
import cookieParser from 'cookie-parser';

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 8000;

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


// API
app.use("/api/v1/user",userRouter)
app.use("/api/v1/need",projectRouter)
app.use("/api/v1/request", requesterRouter)



app.listen(PORT, () => {
  connectDB();
  console.log(`server started on ${PORT}`);

});
