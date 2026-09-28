package com.ucacfc.connect.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "alquiler")
public class Alquiler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Cliente cliente;

    @NotNull(message = "El espacio es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "espacio_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Espacio espacio;

    @NotNull(message = "La fecha del alquiler es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;

    @NotNull(message = "La hora de inicio es obligatoria")
    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @NotNull(message = "La hora de finalización es obligatoria")
    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

   
    @DecimalMin(value = "0.00", message = "El precio no puede ser negativo")
    @Digits(integer = 8, fraction = 2, message = "El precio debe tener como máximo 8 dígitos enteros y 2 decimales")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @NotNull(message = "El estado del alquiler es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoAlquiler estado = EstadoAlquiler.PENDIENTE;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agenda_id", unique = true)
    @JsonIgnore
    private Agenda agenda;

    public Alquiler() {
    }

    public Long getId() {
        return id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public Espacio getEspacio() {
        return espacio;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public EstadoAlquiler getEstado() {
        return estado;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public void setEspacio(Espacio espacio) {
        this.espacio = espacio;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

   public Agenda getAgenda() {
    return agenda;
}

public void setEstado(EstadoAlquiler estado) {
    this.estado = estado;
}

public void setAgenda(Agenda agenda) {
    this.agenda = agenda;
}
}