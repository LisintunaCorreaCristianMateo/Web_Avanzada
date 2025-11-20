const express = require('express');
const cors = require('cors');
const clienteRoutes = require('./routes/cliente.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas base
app.use('/api/clientes', clienteRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Banco Bandido escuchando en http://localhost:${PORT}`);
});
