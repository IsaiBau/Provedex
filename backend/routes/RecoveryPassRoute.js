import express from "express";
import { 
  enviarCodigo, 
  verificarCodigo, 
  actualizarPassword 
} from "../controllers/RecoveryPassword.js";

const router = express.Router();

router.post('/enviar-codigo', enviarCodigo);
router.post('/verificar-codigo', verificarCodigo);
router.patch('/actualizar-password', actualizarPassword);

export default router;