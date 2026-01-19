package com.example.backend_notasDB.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "estudiantes")//especifica el nombre de la tabla en la base de datos
public class Estudiante {
    @Id//clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY)//auto incremento
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    
   
    private LocalDate FechaNacimiento;// remplaza a date y a @Temporal 
                                    // sirve para guardar fecha en DB sin hora

    //relacion con tabla estudiante (1)-(n) nota
    @OneToMany(mappedBy = "estudiante", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Nota> notas;


    //constructores, getters y setters
    public Estudiante() {
    }

    public Estudiante( String nombre, String apellido, String email, LocalDate fechaNacimiento) {
        
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.FechaNacimiento = fechaNacimiento;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getFechaNacimiento() {
        return FechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.FechaNacimiento = fechaNacimiento;
    }
}
