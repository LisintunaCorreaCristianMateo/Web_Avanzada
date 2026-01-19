package com.facturacion.facturacion.model;


public class Factura {
    //Atributos
    private String codigo;
    private String descripcion;
    private int cantidad;
    private double precioUnitario;
    private double descuento;

    private double subtotal;
    private double iva;
    private double total;
    private boolean calculado = false;

    //metodos de acceso


    public String getCodigo() {
        return codigo;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public int getCantidad() {
        return cantidad;
    }
    public double getSubtotal() {
        return subtotal;
    }
    public double getPrecioUnitario() {
        return precioUnitario;
    }
    public double getDescuento() {return descuento;}
    public double getTotal() {
        return total;
    }
    public double getIva() {return iva;
    }

    public boolean isCalculado() { return calculado; }


    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
    public void setDescuento(double descuento) {this.descuento = descuento;}
    public void setSubtotal(double subtotal) {this.subtotal = subtotal;}
    public void setPrecioUnitario(double precioUnitario) { this.precioUnitario = precioUnitario; }
    public void setCalculado(boolean calculado) { this.calculado = calculado; }
    public void setIva(double iva) { this.iva = iva; }
    public void setTotal(double total) { this.total = total; }
}
