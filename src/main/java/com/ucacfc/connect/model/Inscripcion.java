package com.ucacfc.connect.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inscripcion")
public class Inscripcion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @Column(nullable = false)
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoInscripcion estado = EstadoInscripcion.PENDIENTE;

    public Inscripcion() {}

    public Long getId() { return id; }
    public Cliente getCliente() { return cliente; }
    public Curso getCurso() { return curso; }
    public LocalDate getFecha() { return fecha; }
    public EstadoInscripcion getEstado() { return estado; }

    public void setCliente(Cliente v) { cliente = v; }
    public void setCurso(Curso v) { curso = v; }
    public void setFecha(LocalDate v) { fecha = v; }
    public void setEstado(EstadoInscripcion v) { estado = v; }
}
