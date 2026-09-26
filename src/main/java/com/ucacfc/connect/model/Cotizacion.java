package com.ucacfc.connect.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cotizacion")
public class Cotizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El cliente es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cliente cliente;

    @NotNull(message = "La fecha de cotización es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @DecimalMin(value = "0.00", message = "El monto no puede ser negativo")
    @Digits(
        integer = 8,
        fraction = 2,
        message = "El monto debe tener como máximo 8 dígitos enteros y 2 decimales"
    )
    @Column(precision = 10, scale = 2)
    private BigDecimal monto;

    @NotNull(message = "El estado de la cotización es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoCotizacion estado = EstadoCotizacion.PENDIENTE;

    @Valid
    @OneToMany(
        mappedBy = "cotizacion",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<DetalleCotizacion> detalles = new ArrayList<>();

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

    public List<DetalleCotizacion> getDetalles() {
        return detalles;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public void setEstado(EstadoCotizacion estado) {
        this.estado = estado;
    }

    public void setDetalles(List<DetalleCotizacion> detalles) {
        this.detalles.clear();

        if (detalles != null) {
            for (DetalleCotizacion detalle : detalles) {
                agregarDetalle(detalle);
            }
        }
    }

    public void agregarDetalle(DetalleCotizacion detalle) {
        if (detalle != null) {
            detalle.setCotizacion(this);
            this.detalles.add(detalle);
        }
    }

    public void eliminarDetalle(DetalleCotizacion detalle) {
        if (detalle != null) {
            this.detalles.remove(detalle);
            detalle.setCotizacion(null);
        }
    }
}