import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {connectMongo} from './src/config/mongo.js';
import {router} from './src/routes/productoRoutes.js';
import {pedidoRouter} from './src/routes/pedidoRoutes.js';

import 'dotenv/config';
const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/productos', router);
app.use('/api/pedidos', pedidoRouter);
// Conectar a la base de datos
await connectMongo();

app.listen(
    process.env.PORT, () => console.log(`Servidor escuchando en el puerto ${process.env.PORT}`)
);