import{Router} from 'express';
import {mostrarFacturas,crearFactura} from '../controllers/facturaController.js';

export const facturaRouter=Router();
// Definir rutas para la factura
facturaRouter.get('/',mostrarFacturas);
facturaRouter.post('/',crearFactura);