import express from "express";
import {  registerUser, updateUser, getUser } from "../Controllers/userController.js"; // Asegúrate de que la ruta sea correcta

const router = express.Router();
router.post('/getUser', getUser)
//REGISTRAR USUARIO
router.post('/new',registerUser)

//UPDATE USUARIO
router.put('/update',updateUser)

export default router;