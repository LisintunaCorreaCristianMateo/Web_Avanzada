import { Integrante } from '../models/integrantes.js';
import { assignAmigos, resetAmigos } from '../services/assignService.js';

export const createIntegrante = async (req, res) => {
    try {
        const { Nombre, estado } = req.body;
        const nuevo = new Integrante({ Nombre, estado });
        const saved = await nuevo.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getIntegrantes = async (req, res) => {
    try {
        const lista = await Integrante.find();
        res.json(lista);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const assign = async (req, res) => {
    try {
        const result = await assignAmigos();
        res.json({ assigned: result.length });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const reset = async (req, res) => {
    try {
        await resetAmigos();
        res.json({ reset: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const toggleEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const integrante = await Integrante.findById(id);
        if (!integrante) return res.status(404).json({ error: 'No encontrado' });
        integrante.estado = !integrante.estado;
        await integrante.save();
        res.json(integrante);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
