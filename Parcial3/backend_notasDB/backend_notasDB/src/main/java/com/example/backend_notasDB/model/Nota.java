package com.example.backend_notasDB.model;



import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "notas")// nombre de la tabla en DB

public class Nota {

    @Id//clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY)//auto incremento
    private Long id;
    private String asignatura;
    private Double calificacion;

   
    private LocalDate fechaRegistro;


    //relacion con tabla estudiante (1)-(n) notas
    @ManyToOne
    @JoinColumn(name = "estudiante_id") //clave foranea
    private Estudiante estudiante;

    public Nota(String asignatura, Double calificacion, Estudiante estudiante,LocalDate fechaRegistro) {
        this.asignatura = asignatura;
        this.calificacion = calificacion;
        this.estudiante = estudiante;
        this.fechaRegistro=fechaRegistro;
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAsignatura() {
        return asignatura;
    }

    public void setAsignatura(String asignatura) {
        this.asignatura = asignatura;
    }

    public Double getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(Double calificacion) {
        this.calificacion = calificacion;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }
}
