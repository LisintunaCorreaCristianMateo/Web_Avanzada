package com.calculadora.calculadora.services;

import org.springframework.stereotype.Service;

@Service
public class calculadoraService {

    public double calcular(double numero1, double numero2, String operacion) {
        if (operacion == null) {
            throw new IllegalArgumentException("Operación no proporcionada");
        }
        String op = normalizeOperation(operacion);

        switch (op) {
            case "suma" -> {
                return numero1 + numero2;
            }
            case "resta" -> {
                return numero1 - numero2;
            }
            case "multiplicacion" -> {
                return numero1 * numero2;
            }
            case "division" -> {
                if (numero2 == 0) {
                    throw new IllegalArgumentException("División por cero");
                }
                return numero1 / numero2;
            }
            default -> throw new IllegalArgumentException("Operación desconocida: " + operacion);
        }

    }

    private String normalizeOperation(String s) {
        if (s == null)
            return null;
        String trimmed = s.trim();
        String normalized = java.text.Normalizer.normalize(trimmed, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return normalized.replaceAll("\\s+", "").toLowerCase();
    }

}
