package com.ucacfc.connect.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cotizacion")
public class Cotizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El cliente es obligatorio")
    // Relacion de muchos a uno, muchas cotizaciones las puede realizar un solo cliente
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    // Hibernate utiliza objetos especiales para manejar relaciones LAZY, esos objetos pueden contener propiedades internas
    // @JsonIgnoreProperties evita que esas propiedades internas de Hibernate interfieran con el JSON
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cliente cliente;

    @NotNull(message = "La fecha de cotización es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;

    // @Column(columnDefinition = "TEXT") le indica a hibernate que la columna de la BD debe usar el tipo de dato TEXT
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // @Column configura como se almacenara el valor en la base de datos, precision = 10 es igual a 10 numeros y scale 2
    // toma los ultimos 2 numeros de esos 10 ingresados como decimales
    @Column(precision = 10, scale = 2)
    private BigDecimal monto;

    // EstadoCotizacion es un Enum, le dice a java que guarde el ENUM como texto en la base de datos
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoCotizacion estado = EstadoCotizacion.PENDIENTE;

    public Cotizacion() {}

    public Long getId() {
        return id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public EstadoCotizacion getEstado() {
        return estado;
    }

    public void setCliente(Cliente v) {
        cliente = v;
    }

    public void setFecha(LocalDate v) {
        fecha = v;
    }

    public void setDescripcion(String v) {
        descripcion = v;
    }

    public void setMonto(BigDecimal v) {
        monto = v;
    }

    public void setEstado(EstadoCotizacion v) {
        estado = v;
    }
}