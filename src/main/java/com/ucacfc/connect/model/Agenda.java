package com.ucacfc.connect.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "agenda")
public class Agenda {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoEvento tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "espacio_id")
    private Espacio espacio;

    public Agenda() {}

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public LocalDate getFecha() { return fecha; }
    public LocalTime getHoraInicio() { return horaInicio; }
    public LocalTime getHoraFin() { return horaFin; }
    public TipoEvento getTipo() { return tipo; }
    public Espacio getEspacio() { return espacio; }

    public void setTitulo(String v) { titulo = v; }
    public void setDescripcion(String v) { descripcion = v; }
    public void setFecha(LocalDate v) { fecha = v; }
    public void setHoraInicio(LocalTime v) { horaInicio = v; }
    public void setHoraFin(LocalTime v) { horaFin = v; }
    public void setTipo(TipoEvento v) { tipo = v; }
    public void setEspacio(Espacio v) { espacio = v; }
}
