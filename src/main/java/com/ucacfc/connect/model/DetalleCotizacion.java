package com.ucacfc.connect.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "detalle_cotizacion")
public class DetalleCotizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cotizacion_id", nullable = false)
    private Cotizacion cotizacion;

    @NotNull(message = "El tipo de servicio es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_servicio", nullable = false, length = 30)
    private TipoServicioCotizacion tipoServicio;

    @NotNull(message = "La referencia del servicio es obligatoria")
    @Column(name = "servicio_id", nullable = false)
    private Long servicioId;

    @Size(max = 255, message = "La descripción no puede superar los 255 caracteres")
    @Column(length = 255)
    private String descripcion;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser de al menos 1")
    @Column(nullable = false)
    private Integer cantidad = 1;

    @DecimalMin(value = "0.00", message = "El precio unitario no puede ser negativo")
    @Digits(
        integer = 8,
        fraction = 2,
        message = "El precio unitario debe tener como máximo 8 dígitos enteros y 2 decimales"
    )
    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    
    @DecimalMin(value = "0.00", message = "El subtotal no puede ser negativo")
    @Digits(
        integer = 8,
        fraction = 2,
        message = "El subtotal debe tener como máximo 8 dígitos enteros y 2 decimales"
    )
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    public DetalleCotizacion() {}

    public Long getId() {
        return id;
    }

    public Cotizacion getCotizacion() {
        return cotizacion;
    }

    public TipoServicioCotizacion getTipoServicio() {
        return tipoServicio;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setCotizacion(Cotizacion cotizacion) {
        this.cotizacion = cotizacion;
    }

    public void setTipoServicio(TipoServicioCotizacion tipoServicio) {
        this.tipoServicio = tipoServicio;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}