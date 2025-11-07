//levantar el servidor

import express from "express";
import mongoose from "mongoose";
import { Comprador } from "./models/comprador.js";
const app = express();
app.use(express.json());// leer json

//conectar a la base de datos
mongoose
  .connect("mongodb+srv://mateolisintuna:mateo200414@cluster0.vhefvyu.mongodb.net/Compras")
  .then(() => console.log("conectado a la base de datos"))
  .catch((error) => console.log("error al conectar a la base de datos", error));


//rutas
app.get("/", (req, res) => {
    res.send("API de compradores funcionando");
});

// Crear un comprador
app.post("/compradores", async (req, res) => {
    try {
        const comprador = new Comprador(req.body);
        await comprador.save();
        res.status(201).send(comprador);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//listar compradores
app.get("/compradores", async (req, res) => {
    try {
        const compradores = await Comprador.find();
        res.status(200).send(compradores);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// iniciar servidor
app.listen(3000, () => {
    console.log("servidor iniciado en el puerto 3000");
});

