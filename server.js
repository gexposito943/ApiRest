import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import booksRoutes from "./routes/books.js";
import bookstoresRoutes from "./routes/bookstores.js";
import salesRoutes from "./routes/sales.js";
import authRoutes from './routes/auth.js';
import { logRequest } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Logger middleware
app.use(logRequest);

app.get("/", (req, res) => {
  res.json({ missatge: "Benvingut a l'API" });
});

// Rutes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/llibres", booksRoutes);
app.use("/api/v1/llibreries", bookstoresRoutes);
app.use("/api/v1/vendes", salesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Error intern del servidor' 
    });
});
