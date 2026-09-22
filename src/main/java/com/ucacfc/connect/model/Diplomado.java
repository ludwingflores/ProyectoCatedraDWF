package com.ucacfc.connect.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "diplomado")
public class Diplomado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del diplomado es obligatorio")
    @Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
    @Column(nullable = false, length = 150)
    private String nombre;

    @Size(max = 100, message = "La categoría no puede superar los 100 caracteres")
    private String categoria;

    @Size(max = 50, message = "La modalidad no puede superar los 50 caracteres")
    private String modalidad;

    @Size(max = 150, message = "El docente no puede superar los 150 caracteres")
    private String docente;

    @NotNull(message = "El cupo máximo es obligatorio")
    @Min(value = 1, message = "El cupo máximo debe ser mayor que cero")
    @Column(name = "cupo_maximo", nullable = false)
    private Integer cupoMaximo;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    @Size(max = 100, message = "El horario no puede superar los 100 caracteres")
    private String horario;

    @NotNull(message = "El costo es obligatorio")
    @DecimalMin(value = "0.00", message = "El costo no puede ser negativo")
    @Digits(integer = 8, fraction = 2, message = "El costo debe tener como máximo 8 dígitos enteros y 2 decimales")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal costo;

    @NotNull(message = "El estado activo es obligatorio")
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