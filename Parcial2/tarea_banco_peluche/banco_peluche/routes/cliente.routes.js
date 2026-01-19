import express from "express";
import ClienteController from "../controllers/cliente.controller.js";

const router = express.Router();

// Endpoint: POST /api/clientes/calcular
router.post('/calcular', ClienteController.calcular);
router.get('/listar', ClienteController.obtenerClientes);
router.get('/estadisticas', ClienteController.estadisticas);
router.get('/export/pdf', ClienteController.exportarPDF);
router.get('/export/excel', ClienteController.exportarExcel);
router.get('/export/pdf/:id', ClienteController.exportarPDFCliente);
router.get('/export/excel/:id', ClienteController.exportarExcelCliente);

export default router;