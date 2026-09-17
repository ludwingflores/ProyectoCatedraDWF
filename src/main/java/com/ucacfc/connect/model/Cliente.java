package com.ucacfc.connect.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cliente")
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 20)
    private String dui;

    @Column(unique = true, length = 30)
    private String nit;

    @Column(nullable = false, length = 150)
    private String nombre;

    private String empresa;

    @Column(nullable = false, length = 150)
    private String correo;

    private String telefono;

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
