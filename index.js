import express from 'express';
import cors from 'cors';
import scrapingRouter from './src/Router/scrapingRouter.js';
import userRouter from './src/Router/userRouter.js';

const PORT = process.env.PORT || 1234;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS (descomenta esta en producción)
app.use(cors({
  origin: 'https://show-me-the-data.netlify.app',
  credentials: true
}));

// Rutas de scraping
app.use("/scraping", scrapingRouter);
app.use("/user", userRouter)
// Ruta de bienvenida
app.get("/inicio", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://show-me-the-data.netlify.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send("Hola desde el servidor, bienvenido a la API de monedas/crypto");
});

// Iniciar servidor
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
