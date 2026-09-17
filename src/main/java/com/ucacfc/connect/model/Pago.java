package com.ucacfc.connect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pago")
public class Pago {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MetodoPago metodo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoPago estado = EstadoPago.PENDIENTE;

    @Column(nullable = false)
    private LocalDate fecha;
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
