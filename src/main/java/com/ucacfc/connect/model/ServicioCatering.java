package com.ucacfc.connect.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

@Entity
@Table(name = "servicio_catering")
public class ServicioCatering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del servicio de catering es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nombre;
    @NotBlank(message = "El tipo de servicio es obligatorio")
    @Size(max = 50, message = "El tipo de servicio no puede superar los 50 caracteres")
    @Pattern(regexp = "(?i)^(Coffee Break|Desayuno|Almuerzo|Cena|Refrigerio)$", message = "El tipo debe ser Coffee Break, Desayuno, Almuerzo, Cena o Refrigerio")
    @Column(nullable = false, length = 50)
    private String tipo;

    @NotNull(message = "El precio por persona es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio por persona debe ser mayor que cero")
    @Digits(integer = 8, fraction = 2, message = "El precio debe tener como máximo 8 dígitos enteros y 2 decimales")
    @Column(name = "precio_por_persona", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioPorPersona;

    @NotNull(message = "El estado activo es obligatorio")
    @Column(nullable = false)
    private Boolean activo = true;

    public ServicioCatering() {
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public BigDecimal getPrecioPorPersona() {
        return precioPorPersona;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setPrecioPorPersona(BigDecimal precioPorPersona) {
        this.precioPorPersona = precioPorPersona;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}