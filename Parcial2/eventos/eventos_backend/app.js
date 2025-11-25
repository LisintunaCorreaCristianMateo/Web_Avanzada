import express from 'express';
import{dbConnection} from './src/config/database.js';
import cors from 'cors';
import dotenv from 'dotenv';// para .env
import {clienteRouter} from './src/routes/clienteRouter.js';
import {eventoRouter} from './src/routes/eventoRouter.js';
import {facturaRouter} from './src/routes/facturaRouter.js';
dotenv.config();

// Crear instancia de la aplicación Express
const app = express();

// Habilitar CORS (Cross-Origin Resource Sharing) - permite peticiones desde otros dominios/puertos
app.use(cors());

// Middleware para parsear JSON - convierte el body de las peticiones a objetos JavaScript
app.use(express.json());


// ruta raiz
app.get('/', (_req,res) => res.send('Servidor  funcionando correctamente'));   

//ruta clientes

app.use('/api/cliente',clienteRouter);

//ruta eventos
app.use('/api/evento',eventoRouter);
//rutas factura
app.use('/api/factura',facturaRouter);


try{

    // conexion a la base 
    await dbConnection();

    //iniciar sevidor 
    const PORT =process.env.PORT
    app.listen(PORT,()=>console.log('Servidor escuchando en el puerto '+ PORT)

    );

}
catch(error){
    console.error("No se incio el servidor por error de BD");
}