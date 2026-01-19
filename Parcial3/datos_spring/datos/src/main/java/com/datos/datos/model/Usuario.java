package com.datos.datos.model;

public class Usuario {
    private String nombre;
    private String edad;

    // constructores
    public Usuario(String nombre, String edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    // metodos de acceso
    public String getNombre() {
        return nombre;
    }

    public String getEdad() {
        return edad;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEdad(String edad) {
        this.edad = edad;
    }
}