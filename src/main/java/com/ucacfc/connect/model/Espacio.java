package com.ucacfc.connect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "espacio")
public class Espacio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String tipo;

    @Column(nullable = false)
    private Integer capacidad;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

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
