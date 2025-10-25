// models/donacionModel.js

// Clase que representa una donación individual
class Donacion {
  constructor(id, euros, dolares, reales) {
    this.id = id;
    this.euros = euros;
    this.dolares = dolares;
    this.reales = reales;
  }

  // Convierte a pesos argentinos
  convertirAPesos() {
    const euroAPesos = 160.7;
    const dolarAPesos = 130.2;
    const realAPesos = 50.7;
    return (
      this.euros * euroAPesos +
      this.dolares * dolarAPesos +
      this.reales * realAPesos
    );
  }

  // Calcula distribución de la donación
  calcularDistribucion() {
    const total = this.convertirAPesos();
    const centroSalud = total * 0.6;
    const comedorNinos = total * 0.3;
    const gastosAdm = total * 0.1;

    return {
      totalPesos: total.toFixed(2),
      centroSalud: centroSalud.toFixed(2),
      comedorNinos: comedorNinos.toFixed(2),
      gastosAdministrativos: gastosAdm.toFixed(2),
    };
  }
}

// Clase que administra todas las donaciones (modelo general)
class DonacionModel {
  static donaciones = [new Donacion(1, 100, 200, 300)];

  static obtenerTodas() {
    return this.donaciones;
  }

  static obtenerPorId(id) {
    return this.donaciones.find((d) => d.id === parseInt(id));
  }

  static crear(euros, dolares, reales) {
    const id = this.donaciones.length + 1;
    const nueva = new Donacion(id, euros, dolares, reales);
    this.donaciones.push(nueva);
    return nueva;
  }

  static actualizar(id, datos) {
    const donacion = this.obtenerPorId(id);
    if (!donacion) return null;
    donacion.euros = datos.euros ?? donacion.euros;
    donacion.dolares = datos.dolares ?? donacion.dolares;
    donacion.reales = datos.reales ?? donacion.reales;
    return donacion;
  }

  static eliminar(id) {
    const index = this.donaciones.findIndex((d) => d.id === parseInt(id));
    if (index !== -1) {
      return this.donaciones.splice(index, 1)[0];
    }
    return null;
  }
}

//  Exportamos AMBAS clases correctamente
export { Donacion };
export default DonacionModel;
