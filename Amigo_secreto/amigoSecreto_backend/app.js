import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import integranteRoutes from './src/routes/integranteRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';

dotenv.config();

const app = express();

// Security middlewares
app.use(helmet());
app.use(compression());

// Logging (only in dev)
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

// Basic rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// CORS - en producción restringir a dominios conocidos
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));

app.use(express.json());

// health-check
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/integrantes', integranteRoutes);
app.use('/api/events', eventRoutes);

// En producción, servir frontend estático si existe
if (process.env.SERVE_STATIC === 'true') {
	const __dirname = path.resolve();
	const staticDir = process.env.STATIC_DIR || path.join(__dirname, '../amigosecreto_front/dist');
	app.use(express.static(staticDir));
	app.get('*', (req, res) => {
		res.sendFile(path.join(staticDir, 'index.html'));
	});
}

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amigosecreto';

mongoose.connect(MONGO)
		.then(() => {
				console.log('Connected to MongoDB');
				// bind to all interfaces so other devices on the LAN can reach the backend
				app.listen(PORT, '0.0.0.0', () => console.log(`Server running on 0.0.0.0:${PORT}`));
		})
		.catch(err => {
				console.error('Mongo connection error', err);
				process.exit(1);
		});

export default app;
