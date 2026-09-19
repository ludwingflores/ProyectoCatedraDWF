package com.ucacfc.connect.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "inscripcion")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El cliente es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cliente cliente;

    @NotNull(message = "El curso es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "curso_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Curso curso;

    @NotNull(message = "La fecha de inscripción es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;

    @NotNull(message = "El estado de la inscripción es obligatorio")
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