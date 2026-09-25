package com.ucacfc.connect.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "cliente")
@Schema(description = "Entidad que representa a un cliente registrado (persona natural o jurídica)")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único incremental asignado por el sistema", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Size(max = 20, message = "El DUI no puede superar los 20 caracteres")
    @Column(unique = true, length = 20)
    @Schema(description = "Documento Único de Identidad (DUI) del cliente", example = "05123456-7")
    private String dui;

    @Size(max = 30, message = "El NIT no puede superar los 30 caracteres")
    @Column(unique = true, length = 30)
    @Schema(description = "Número de Identificación Tributaria (NIT)", example = "0614-250998-102-1")
    private String nit;

    @NotBlank(message = "El nombre del cliente es obligatorio")
    @Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
    @Column(nullable = false, length = 150)
    @Schema(description = "Nombre completo del cliente o persona de contacto", example = "Carlos Isaac Reyes", requiredMode = Schema.RequiredMode.REQUIRED)
    private String nombre;

    @Size(max = 150, message = "El nombre de la empresa no puede superar los 150 caracteres")
    @Schema(description = "Nombre de la empresa o institución representada (opcional)", example = "InnovaCloud Solutions")
    private String empresa;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Debe ingresar un correo electrónico válido")
    @Size(max = 150, message = "El correo no puede superar los 150 caracteres")
    @Column(nullable = false, length = 150)
    @Schema(description = "Dirección de correo electrónico principal", example = "carlos.reyes@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    private String correo;

    @Size(max = 30, message = "El teléfono no puede superar los 30 caracteres")
    @Column(length = 30)
    @Schema(description = "Número de teléfono fijo o móvil", example = "2257-8000")
    private String telefono;

    @Size(max = 255, message = "La dirección no puede superar los 255 caracteres")
    @Schema(description = "Dirección de residencia o domicilio fiscal", example = "Final de la 53 Av. Norte y Calle Poniente, San Salvador")
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