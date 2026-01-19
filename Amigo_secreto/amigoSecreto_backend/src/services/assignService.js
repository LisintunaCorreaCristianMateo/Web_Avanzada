import { Integrante } from '../models/integrantes.js';

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export async function assignAmigos() {
    const participantes = await Integrante.find({ estado: true });
    if (participantes.length < 2) {
        throw new Error('Se requieren al menos 2 participantes activos para asignar.');
    }

    // clonamos y barajamos
    const pool = participantes.map(p => p.toObject());
    shuffle(pool);

    // asignar cada uno al siguiente (circular)
    const updates = [];
    for (let i = 0; i < pool.length; i++) {
        const current = pool[i];
        const friend = pool[(i + 1) % pool.length];
        updates.push({
            _id: current._id,
            amigoSecreto: { id: friend._id, Nombre: friend.Nombre }
        });
    }

    // guardar cambios en BD
    const promises = updates.map(u => Integrante.findByIdAndUpdate(u._id, { amigoSecreto: u.amigoSecreto }, { new: true }));
    const result = await Promise.all(promises);
    return result;
}

export async function resetAmigos() {
    await Integrante.updateMany({}, { $set: { amigoSecreto: null } });
    return true;
}
