package com.facturacion.facturacion.service;

import org.springframework.stereotype.Service;

import com.facturacion.facturacion.model.Factura;

@Service
public class FacturaService {

    public void calcularTotal(Factura factura) {
        double subtotal = factura.getCantidad() * factura.getPrecioUnitario();
        double iva = subtotal * 0.12;
        double total = subtotal + iva - factura.getDescuento();
        
        factura.setSubtotal(subtotal);
        factura.setIva(iva);
        factura.setTotal(total);
        factura.setCalculado(true);
    }
}
