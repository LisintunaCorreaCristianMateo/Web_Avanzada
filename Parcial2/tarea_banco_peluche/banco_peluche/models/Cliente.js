class Cliente {
  constructor(nombre, dni, edad, saldoAnterior, montoCompras, pagoRealizado) {
    this.nombre = nombre;
    this.dni = dni;
    this.edad = Number(edad);
    this.saldoAnterior = Number(saldoAnterior);
    this.montoCompras = Number(montoCompras);
    this.pagoRealizado = Number(pagoRealizado);
  }
}

export default Cliente;