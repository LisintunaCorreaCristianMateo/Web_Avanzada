package com.facturacion.facturacion.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.facturacion.facturacion.model.Factura;
import com.facturacion.facturacion.service.FacturaService;

@Controller
@RequestMapping("/factura")
public class FacturaController {
    
    private final FacturaService facturaService;

    public FacturaController(FacturaService facturaService) {
        this.facturaService = facturaService;
    }

    // Ruta inicial
    @GetMapping("/form")
    public String formularioFactura(Model model) {
        if (!model.containsAttribute("factura")) {
            model.addAttribute("factura", new Factura());
        }
        return "factura";
    }

    @PostMapping("/calcular")
    public String calcularFactura(@ModelAttribute Factura factura, Model model) {
        facturaService.calcularTotal(factura);
        model.addAttribute("factura", factura);
        return "factura";
    }
}