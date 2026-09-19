package com.ucacfc.connect.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El cliente es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cliente cliente;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor que cero")
    @Digits(
            integer = 8,
            fraction = 2,
            message = "El monto debe tener como máximo 8 dígitos enteros y 2 decimales"
    )
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @NotNull(message = "El método de pago es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MetodoPago metodo;

    @NotNull(message = "El estado del pago es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoPago estado = EstadoPago.PENDIENTE;

    @NotNull(message = "La fecha del pago es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;

    @Size(max = 100, message = "La referencia no puede superar los 100 caracteres")
    private String referencia;

    public Pago() {}

    public Long getId() { return id; }
    public Cliente getCliente() { return cliente; }
    public BigDecimal getMonto() { return monto; }
    public MetodoPago getMetodo() { return metodo; }
    public EstadoPago getEstado() { return estado; }
    public LocalDate getFecha() { return fecha; }
    public String getReferencia() { return referencia; }

    public void setCliente(Cliente v) { cliente = v; }
    public void setMonto(BigDecimal v) { monto = v; }
    public void setMetodo(MetodoPago v) { metodo = v; }
    public void setEstado(EstadoPago v) { estado = v; }
    public void setFecha(LocalDate v) { fecha = v; }
    public void setReferencia(String v) { referencia = v; }
}