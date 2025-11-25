import {Router} from 'express';
import {mostrarClientes,crearCliente} from '../controllers/clienteController.js';

export const clienteRouter=Router();
// Definir rutas para el cliente

clienteRouter.get('/',mostrarClientes);
clienteRouter.post('/',crearCliente);
