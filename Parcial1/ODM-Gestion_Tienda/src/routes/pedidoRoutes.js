import { Router } from 'express';
import {
    crearPedido,
    listarPedidos
} from '../controlles/pedidoController.js';

export const pedidoRouter = Router();

pedidoRouter.post('/', crearPedido);
pedidoRouter.get('/', listarPedidos);
