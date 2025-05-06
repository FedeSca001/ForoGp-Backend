import express from 'express';
import cors from 'cors';
import userRouter from './src/Router/userRouter.js';
import dotenv from 'dotenv';

const PORT = process.env.PORT || 1234;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS (descomenta esta en producción)
/*app.use(cors({
  origin: 'https://show-me-the-data.netlify.app',
  credentials: true
}));*/
app.use(cors())
// Rutas de scraping
app.use("/user", userRouter)
// Ruta de bienvenida
app.get("/inicio", (req, res) => {
  res.send("Hola desde el servidor, bienvenido a la API de monedas/crypto");
});

// Iniciar servidor
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
