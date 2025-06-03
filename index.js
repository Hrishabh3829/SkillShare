import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import connectDB from './utils/db.js';

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 8000;

//Middleware
app.use(express.json())


// API
app.use("/api/v1/user",userRouter)



app.listen(PORT, () => {
  connectDB();
  console.log(`server started on ${PORT}`);

});
