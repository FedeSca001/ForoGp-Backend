import express from "express";
import { updateCalendario } from "../Scraping/CalendarioMotoGp.js";
import { resultadosSession } from "../Scraping/TimesTable.js";

const router = express.Router();

// Rutas de scraping
router.get("/calendario-moto-gp", updateCalendario);
router.get("/times-table", resultadosSession);

export default router;
