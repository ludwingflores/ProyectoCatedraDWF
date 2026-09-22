package com.ucacfc.connect.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "espacio")
public class Espacio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del espacio es obligatorio")
    @Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
    @Column(nullable = false, length = 150)
    private String nombre;

    @NotBlank(message = "El tipo de espacio es obligatorio")
    @Size(max = 100, message = "El tipo no puede superar los 100 caracteres")
    @Column(nullable = false, length = 100)
    private String tipo;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad debe ser de al menos 1 persona")
    @Column(nullable = false)
    private Integer capacidad;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.00", message = "El precio no puede ser negativo")
    @Digits(integer = 8, fraction = 2,
            message = "El precio debe tener como máximo 8 dígitos enteros y 2 decimales")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @NotNull(message = "La disponibilidad es obligatoria")
    @Column(nullable = false)
    private Boolean disponible = true;

    @Column(columnDefinition = "TEXT")
    private String equipamiento;

    public Espacio() {}

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getTipo() { return tipo; }
    public Integer getCapacidad() { return capacidad; }
    public BigDecimal getPrecio() { return precio; }
    public Boolean getDisponible() { return disponible; }
    public String getEquipamiento() { return equipamiento; }

    public void setNombre(String v) { nombre = v; }
    public void setTipo(String v) { tipo = v; }
    public void setCapacidad(Integer v) { capacidad = v; }
    public void setPrecio(BigDecimal v) { precio = v; }
    public void setDisponible(Boolean v) { disponible = v; }
    public void setEquipamiento(String v) { equipamiento = v; }
}