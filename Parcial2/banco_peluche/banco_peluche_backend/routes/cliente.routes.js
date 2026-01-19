const express = require('express');
const ClienteController = require('../controllers/cliente.controller');

const router = express.Router();

// Endpoint: POST /api/clientes/calcular
router.post('/calcular', ClienteController.calcular);

module.exports = router;
