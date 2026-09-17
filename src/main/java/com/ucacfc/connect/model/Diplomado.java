package com.ucacfc.connect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "diplomado")
public class Diplomado {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;
    private String categoria;
    private String modalidad;
    private String docente;

    @Column(name = "cupo_maximo", nullable = false)
    private Integer cupoMaximo;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String horario;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal costo;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    public Diplomado() {}

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public String getCategoria() { return categoria; }
    public String getModalidad() { return modalidad; }
    public String getDocente() { return docente; }
    public Integer getCupoMaximo() { return cupoMaximo; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public String getHorario() { return horario; }
    public BigDecimal getCosto() { return costo; }
    public Boolean getActivo() { return activo; }

    public void setNombre(String v) { nombre = v; }
    public void setDescripcion(String v) { descripcion = v; }
    public void setCategoria(String v) { categoria = v; }
    public void setModalidad(String v) { modalidad = v; }
    public void setDocente(String v) { docente = v; }
    public void setCupoMaximo(Integer v) { cupoMaximo = v; }
    public void setFechaInicio(LocalDate v) { fechaInicio = v; }
    public void setFechaFin(LocalDate v) { fechaFin = v; }
    public void setHorario(String v) { horario = v; }
    public void setCosto(BigDecimal v) { costo = v; }
    public void setActivo(Boolean v) { activo = v; }
}
