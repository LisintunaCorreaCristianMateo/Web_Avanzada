import { AuthService } from '../services/authService.js';

/**
 * Controlador de autenticación
 */
export class AuthController {

  /**
   * Login de usuario
   */
  static async login(req, res) {
    try {
      console.log('📨 Petición de login recibida');
      console.log('📦 Body:', req.body);
      
      const { username, password } = req.body;

      if (!username || !password) {
        console.log('⚠️ Faltan datos:', { username, password });
        return res.status(400).json({ error: 'Username y password requeridos' });
      }

      const resultado = await AuthService.autenticar(username, password);

      console.log('✅ Login exitoso, enviando respuesta');
      res.json(resultado);
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      res.status(401).json({ error: error.message || 'Credenciales inválidas' });
    }
  }

}
