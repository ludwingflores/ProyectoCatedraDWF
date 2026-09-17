package com.ucacfc.connect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cotizacion")
public class Cotizacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)

    private Cliente cliente;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(precision = 10, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoCotizacion estado = EstadoCotizacion.PENDIENTE;

    public Cotizacion() {}

    public Long getId() { return id; }
    public Cliente getCliente() { return cliente; }
    public LocalDate getFecha() { return fecha; }
    public String getDescripcion() { return descripcion; }
    public BigDecimal getMonto() { return monto; }
    public EstadoCotizacion getEstado() { return estado; }

    public void setCliente(Cliente v) { cliente = v; }
    public void setFecha(LocalDate v) { fecha = v; }
    public void setDescripcion(String v) { descripcion = v; }
    public void setMonto(BigDecimal v) { monto = v; }
    public void setEstado(EstadoCotizacion v) { estado = v; }
}
