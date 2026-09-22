package com.ucacfc.connect.model;

import jakarta.persistence.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 20, message = "El DUI no puede superar los 20 caracteres")
    @Column(unique = true, length = 20)
    private String dui;

    @Size(max = 30, message = "El NIT no puede superar los 30 caracteres")
    @Column(unique = true, length = 30)
    private String nit;

    @NotBlank(message = "El nombre del cliente es obligatorio")
    @Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
    @Column(nullable = false, length = 150)
    private String nombre;

    @Size(max = 150, message = "El nombre de la empresa no puede superar los 150 caracteres")
    private String empresa;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Debe ingresar un correo electrónico válido")
    @Size(max = 150, message = "El correo no puede superar los 150 caracteres")
    @Column(nullable = false, length = 150)
    private String correo;

    @Size(max = 30, message = "El teléfono no puede superar los 30 caracteres")
    @Column(length = 30)
    private String telefono;

    @Size(max = 255, message = "La dirección no puede superar los 255 caracteres")
    private String direccion;

    public Cliente() {}

    public Long getId() { return id; }

    public String getDui() { return dui; }

    public String getNit() { return nit; }

    public String getNombre() { return nombre; }

    public String getEmpresa() { return empresa; }

    public String getCorreo() { return correo; }

    public String getTelefono() { return telefono; }

    public String getDireccion() { return direccion; }

    public void setDui(String dui) { this.dui = dui; }

    public void setNit(String nit) { this.nit = nit; }

    public void setNombre(String nombre) { this.nombre = nombre; }

    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public void setCorreo(String correo) { this.correo = correo; }

    public void setTelefono(String telefono) { this.telefono = telefono; }

    public void setDireccion(String direccion) { this.direccion = direccion; }
}
