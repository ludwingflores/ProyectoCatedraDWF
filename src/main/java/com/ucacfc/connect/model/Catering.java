package com.ucacfc.connect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "catering")
public class Catering {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "tipo_servicio", nullable = false, length = 100)
    private String tipoServicio;

    @Column(name = "numero_asistentes", nullable = false)
    private Integer numeroAsistentes;

    @Column(columnDefinition = "TEXT")
    private String menu;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    @Column(nullable = false)
    private String lugar;

    @Column(precision = 10, scale = 2)
    private BigDecimal costo;

    private String estado;

    public Catering() {}

    public Long getId() { return id; }
    public Cliente getCliente() { return cliente; }
    public String getTipoServicio() { return tipoServicio; }
    public Integer getNumeroAsistentes() { return numeroAsistentes; }
    public String getMenu() { return menu; }
    public LocalDate getFecha() { return fecha; }
    public LocalTime getHora() { return hora; }
    public String getLugar() { return lugar; }
    public BigDecimal getCosto() { return costo; }
    public String getEstado() { return estado; }

    public void setCliente(Cliente v) { cliente = v; }
    public void setTipoServicio(String v) { tipoServicio = v; }
    public void setNumeroAsistentes(Integer v) { numeroAsistentes = v; }
    public void setMenu(String v) { menu = v; }
    public void setFecha(LocalDate v) { fecha = v; }
    public void setHora(LocalTime v) { hora = v; }
    public void setLugar(String v) { lugar = v; }
    public void setCosto(BigDecimal v) { costo = v; }
    public void setEstado(String v) { estado = v; }
}
