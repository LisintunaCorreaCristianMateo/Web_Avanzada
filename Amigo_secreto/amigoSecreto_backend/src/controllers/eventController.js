import { Event } from '../models/event.js';

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const createEvent = async (req, res) => {
    try {
        const { titulo, fecha, participantes } = req.body;
        console.log('createEvent payload:', req.body);
        if (!titulo) return res.status(400).json({ error: 'Falta campo "titulo".' });
        if (!fecha) return res.status(400).json({ error: 'Falta campo "fecha".' });
        if (!Array.isArray(participantes)) return res.status(400).json({ error: 'El campo "participantes" debe ser un array.' });
        if (participantes.length < 2) return res.status(400).json({ error: 'Se requieren al menos 2 participantes.' });

        // validar formato de participantes
        for (let i = 0; i < participantes.length; i++) {
            const p = participantes[i];
            if (typeof p === 'string') continue;
            if (typeof p === 'object') {
                if (!p.Nombre || typeof p.Nombre !== 'string') return res.status(400).json({ error: `Participante en índice ${i} inválido: falta "Nombre".` });
                if (p.restrictions && !Array.isArray(p.restrictions)) return res.status(400).json({ error: `Participante ${p.Nombre}: "restrictions" debe ser un array si está presente.` });
                // restrictions may be array of names (strings)
                if (p.restrictions && p.restrictions.some(r => typeof r !== 'string')) return res.status(400).json({ error: `Participante ${p.Nombre}: todos los elementos en "restrictions" deben ser nombres (strings).` });
                continue;
            }
            return res.status(400).json({ error: `Participante en índice ${i} tiene un formato no soportado.` });
        }

        // participantes puede ser array de strings o de objetos { Nombre, restrictions?: [nombres] }
        const participantesDocs = participantes.map(p => {
            if (typeof p === 'string') return { Nombre: p, restrictions: [] };
            return { Nombre: p.Nombre, restrictions: [] };
        });

        let evento = new Event({ titulo, fecha: new Date(fecha), participantes: participantesDocs });
        let saved = await evento.save();

        // si el input incluía restricciones por nombre, las resolvemos a ObjectId una vez tenemos los _id
        const nameToId = new Map(saved.participantes.map(p => [p.Nombre, p._id]));
        let needsUpdate = false;
        for (let i = 0; i < participantes.length; i++) {
            const inputP = participantes[i];
            if (typeof inputP === 'object' && Array.isArray(inputP.restrictions) && inputP.restrictions.length > 0) {
                const targetIds = inputP.restrictions.map(name => nameToId.get(name)).filter(Boolean);
                if (targetIds.length > 0) {
                    saved.participantes[i].restrictions = targetIds;
                    needsUpdate = true;
                }
            }
        }
        if (needsUpdate) {
            await saved.save();
            saved = await Event.findById(saved._id);
        }

        res.status(201).json({ eventId: saved._id, saved });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getEventAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await Event.findById(id);
        if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
        res.json(evento);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const assignEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await Event.findById(id);
        if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
        if (evento.assigned) return res.status(400).json({ error: 'Ya se asignaron los amigos para este evento.' });

        // preparar datos para la asignación con restricciones
        const participants = evento.participantes.map(p => ({
            id: p._id.toString(),
            Nombre: p.Nombre,
            restrictions: (p.restrictions || []).map(r => r.toString())
        }));

        const ids = participants.map(p => p.id);

        // backtracking para encontrar una asignación válida
        function findAssignment(idx, available, order) {
            if (idx === order.length) return {};
            const pid = order[idx];
            const person = participants.find(p => p.id === pid);

            // candidates shuffled for variability
            for (let i = 0; i < available.length; i++) {
                const candidate = available[i];
                if (candidate === pid) continue; // no asignarse a sí mismo
                if (person.restrictions.includes(candidate)) continue; // respeta restricciones

                const nextAvailable = available.filter(a => a !== candidate);
                const rest = findAssignment(idx + 1, nextAvailable, order);
                if (rest !== null) {
                    return Object.assign({ [pid]: candidate }, rest);
                }
            }
            return null;
        }

        // intentar varias órdenes aleatorias para aumentar probabilidades
        function shuffled(arr) {
            const a = arr.slice();
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        let assignment = null;
        const attempts = Math.max(50, participants.length * 10);
        for (let t = 0; t < attempts && assignment === null; t++) {
            const order = shuffled(ids);
            const available = shuffled(ids);
            assignment = findAssignment(0, available, order);
        }

        if (!assignment) return res.status(400).json({ error: 'No es posible generar asignaciones respetando las restricciones.' });

        // aplicar asignaciones
        evento.participantes.forEach(p => {
            const assignedId = assignment[p._id.toString()];
            if (assignedId) {
                const assignedParticipant = evento.participantes.find(x => x._id.toString() === assignedId);
                p.amigoSecreto = { id: assignedId, Nombre: assignedParticipant ? assignedParticipant.Nombre : null };
            } else {
                p.amigoSecreto = null;
            }
        });
        evento.assigned = true;
        await evento.save();
        res.json({ assigned: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const listParticipants = async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await Event.findById(id).select('participantes titulo fecha assigned');
        if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
        // devolver solo ids y nombres para que el invitado seleccione
        const lista = evento.participantes.map(p => ({ id: p._id, Nombre: p.Nombre }));
        res.json({ titulo: evento.titulo, fecha: evento.fecha, participantes: lista, assigned: evento.assigned });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const listEvents = async (req, res) => {
    try {
        // devolver lista ligera de eventos — usar lean() para mejor rendimiento
        const eventos = await Event.find({}).select('titulo fecha assigned').sort({ createdAt: -1 }).limit(200).lean();
        const mapped = eventos.map(e => ({ id: e._id, titulo: e.titulo, fecha: e.fecha, assigned: e.assigned }));
        res.json(mapped);
    } catch (err) {
        console.error('listEvents error:', err);
        res.status(500).json({ error: 'Error listando eventos', details: err.message });
    }
};

export const revealForParticipant = async (req, res) => {
    try {
        const { id, pid } = req.params;
        const evento = await Event.findById(id);
        if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
        const participante = evento.participantes.id(pid);
        if (!participante) return res.status(404).json({ error: 'Participante no encontrado' });

        // Si ya se asignó globalmente, devolvemos directamente
        if (evento.assigned) return res.json({ amigoSecreto: participante.amigoSecreto });

        // Si este participante ya tiene asignado, devolverlo
        if (participante.amigoSecreto) return res.json({ amigoSecreto: participante.amigoSecreto });

        // Intentar asignaciones solo para participantes no asignados, respetando restricciones
        const all = evento.participantes.map(p => ({
            id: p._id.toString(),
            Nombre: p.Nombre,
            restrictions: (p.restrictions || []).map(r => r.toString()),
            assignedTo: p.amigoSecreto ? (p.amigoSecreto.id ? p.amigoSecreto.id.toString() : String(p.amigoSecreto.id)) : null
        }));

        const alreadyAssigned = new Set(all.filter(p => p.assignedTo).map(p => p.assignedTo));
        const remainingGivers = all.filter(p => !p.assignedTo).map(p => p.id);
        const ids = all.map(p => p.id);

        function shuffled(arr) {
            const a = arr.slice();
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        function findAssignment(idx, order, used) {
            if (idx === order.length) return {};
            const gid = order[idx];
            const person = all.find(x => x.id === gid);

            const candidates = ids.filter(cid => cid !== gid && !used.has(cid) && !person.restrictions.includes(cid));
            const candOrder = shuffled(candidates);
            for (let c of candOrder) {
                const nextUsed = new Set(used);
                nextUsed.add(c);
                const rest = findAssignment(idx + 1, order, nextUsed);
                if (rest !== null) {
                    return Object.assign({ [gid]: c }, rest);
                }
            }
            return null;
        }

        let assignment = null;
        const attempts = Math.max(50, remainingGivers.length * 10);
        for (let t = 0; t < attempts && assignment === null; t++) {
            const order = shuffled(remainingGivers.slice());
            assignment = findAssignment(0, order, new Set(alreadyAssigned));
        }

        if (!assignment) {
            return res.status(400).json({ error: 'No se pudo generar una asignación válida para los participantes restantes.' });
        }

        // Aplicar asignaciones encontradas
        evento.participantes.forEach(p => {
            const aid = assignment[p._id.toString()];
            if (aid) {
                const assigned = evento.participantes.find(x => x._id.toString() === aid);
                p.amigoSecreto = { id: aid, Nombre: assigned ? assigned.Nombre : null };
            }
        });

        // Si ahora todos tienen asignación, marcar evento como assigned
        const allAssigned = evento.participantes.every(p => p.amigoSecreto);
        if (allAssigned) evento.assigned = true;

        await evento.save();

        const updatedParticipant = evento.participantes.id(pid);
        res.json({ amigoSecreto: updatedParticipant.amigoSecreto });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
