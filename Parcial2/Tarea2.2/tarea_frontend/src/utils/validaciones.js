/**
 * Valida una cédula ecuatoriana
 * @param {string} cedula - Cédula a validar (10 dígitos)
 * @returns {boolean} - True si es válida, false si no
 */
export const validarCedulaEcuatoriana = (cedula) => {
  // Verificar que tenga 10 dígitos
  if (!cedula || cedula.length !== 10) {
    return false;
  }

  // Verificar que solo contenga números
  if (!/^\d+$/.test(cedula)) {
    return false;
  }

  // Extraer los dígitos
  const digitos = cedula.split('').map(Number);

  // Verificar que los dos primeros dígitos sean válidos (provincia: 01-24)
  const provincia = parseInt(cedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) {
    return false;
  }

  // Verificar el tercer dígito (debe ser menor a 6 para personas naturales)
  if (digitos[2] >= 6) {
    return false;
  }

  // Algoritmo de validación del dígito verificador (módulo 10)
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = digitos[i] * coeficientes[i];
    
    // Si el valor es mayor a 9, se resta 9
    if (valor > 9) {
      valor -= 9;
    }
    
    suma += valor;
  }

  // Calcular el dígito verificador
  const residuo = suma % 10;
  const digitoVerificador = residuo === 0 ? 0 : 10 - residuo;

  // Comparar con el último dígito de la cédula
  return digitoVerificador === digitos[9];
};

/**
 * Obtiene un mensaje de error descriptivo para cédula inválida
 * @param {string} cedula - Cédula a validar
 * @returns {string|null} - Mensaje de error específico o null si es válida
 */
export const obtenerErrorCedula = (cedula) => {
  if (!cedula) {
    return 'La cédula es requerida';
  }

  if (cedula.length !== 10) {
    return 'La cédula debe tener exactamente 10 dígitos';
  }

  if (!/^\d+$/.test(cedula)) {
    return 'La cédula solo debe contener números';
  }

  const provincia = parseInt(cedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) {
    return 'Los dos primeros dígitos deben corresponder a una provincia válida (01-24)';
  }

  const tercerDigito = parseInt(cedula[2]);
  if (tercerDigito >= 6) {
    return 'El tercer dígito debe ser menor a 6 (cédula de persona natural)';
  }

  if (!validarCedulaEcuatoriana(cedula)) {
    return 'El dígito verificador de la cédula es incorrecto';
  }

  return null;
};
