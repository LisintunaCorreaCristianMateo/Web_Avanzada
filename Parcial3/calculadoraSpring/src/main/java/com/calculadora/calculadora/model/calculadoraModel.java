package com.calculadora.calculadora.model;

public class calculadoraModel {

	private Double numero1;
	private Double numero2;
	private String operacion;
	private Double resultado;


	public calculadoraModel(Double numero1, Double numero2, String operacion, Double resultado) {
		this.numero1 = numero1;
		this.numero2 = numero2;
		this.operacion = operacion;
		this.resultado = resultado;
	}

	public Double getNumero1() {
		return numero1;
	}

	public void setNumero1(Double numero1) {
		this.numero1 = numero1;
	}

	public Double getNumero2() {
		return numero2;
	}

	public void setNumero2(Double numero2) {
		this.numero2 = numero2;
	}

	public String getOperacion() {
		return operacion;
	}

	public void setOperacion(String operacion) {
		this.operacion = operacion;
	}

	public Double getResultado() {
		return resultado;
	}

	public void setResultado(Double resultado) {
		this.resultado = resultado;
	}

}
    