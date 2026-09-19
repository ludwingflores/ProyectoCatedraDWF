package com.ucacfc.connect.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del rol es obligatorio")
    @Size(max = 50, message = "El nombre del rol no puede superar los 50 caracteres")
    @Column(nullable = false, unique = true, length = 50)
    private String nombre;

    public Rol() {}

    public Rol(String nombre) {
        this.nombre = nombre;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}