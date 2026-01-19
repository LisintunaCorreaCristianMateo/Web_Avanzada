import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuarioModel.js';

/**
 * Servicio para autenticación simple
 */
export class AuthService {
  
  /**
   * Autentica un usuario
   * @param {string} username 
   * @param {string} password 
   * @returns {Object} Datos básicos del usuario
   */
  static async autenticar(username, password) {
    try {
      console.log('🔍 Buscando usuario:', username);
      
      const usuario = await Usuario.findOne({
        where: { username }
      });

      if (!usuario) {
        console.log('❌ Usuario no encontrado');
        throw new Error('Credenciales inválidas');
      }

      console.log('✓ Usuario encontrado:', usuario.username);
      console.log('🔑 Comparando contraseñas...');
      
      // Comparación simple de texto (INSEGURO - solo para desarrollo)
      const passwordValido = password === usuario.password;
      
      console.log('🔑 Password válido:', passwordValido);
      
      if (!passwordValido) {
        console.log('❌ Contraseña incorrecta');
        throw new Error('Credenciales inválidas');
      }

      console.log('✅ Autenticación exitosa');
      
      return {
        usuario: {
          id: usuario.id,
          username: usuario.username
        }
      };
    } catch (error) {
      console.error('❌ Error en autenticación:', error.message);
      throw error;
    }
  }

}
