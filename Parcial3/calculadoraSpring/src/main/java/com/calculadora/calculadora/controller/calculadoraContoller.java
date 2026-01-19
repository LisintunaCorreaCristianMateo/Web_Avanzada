package com.calculadora.calculadora.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.calculadora.calculadora.model.calculadoraModel;
import com.calculadora.calculadora.services.calculadoraService;

@RestController

@RequestMapping("/api/calculadora")
public class calculadoraContoller{

	private final calculadoraService service;//instancia de servicio
				                             //para poder usar sus metodos

	// constructor de inyección de dependencia
	public calculadoraContoller(calculadoraService service){
		this.service=service;
	}

	
	@GetMapping("/")
	public ResponseEntity<String> info() {
		String msg = "Api de calculador funcionando correctamente ";
		return ResponseEntity.ok(msg);
	}


	@PostMapping("/calcular")
	public calculadoraModel calcular(@RequestBody calculadoraModel model) {
		double resultado = service.calcular(model.getNumero1(), model.getNumero2(), model.getOperacion());
		model.setResultado(resultado);
		return model;
	}

}
