import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();


const app = express();

// Enable CORS for all routes and origins BEFORE other middlewares
app.use(cors({
  origin: 'http://localhost:5173', // or specify your frontend origin like 'http://localhost:5173'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes here
import tokenRoutes from './routes/tokenRoutes';
app.use('/api', tokenRoutes);


// Add a generic OPTIONS handler to respond to preflight if needed
app.options('*', cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
