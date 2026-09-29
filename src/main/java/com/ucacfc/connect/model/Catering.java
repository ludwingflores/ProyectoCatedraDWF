package com.ucacfc.connect.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "catering")
public class Catering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // CLIENTE
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Cliente cliente;

    // =========================================================
    // SERVICIO DE CATERING
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servicio_catering_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private ServicioCatering servicioCatering;

    // =========================================================
    // DATOS DEL SERVICIO
    // =========================================================

    @Column(
            name = "tipo_servicio",
            nullable = false,
            length = 100
    )
    private String tipoServicio;

    @NotNull(message = "El número de asistentes es obligatorio")
    @Min(
            value = 1,
            message = "Debe haber al menos 1 asistente"
    )
    @Column(
            name = "numero_asistentes",
            nullable = false
    )
    private Integer numeroAsistentes;

    @Column(
            name = "precio_por_persona",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal precioPorPersona;

    @NotBlank(message = "El menú es obligatorio")
    @Column(
            columnDefinition = "TEXT",
            nullable = false
    )
    private String menu;

    // =========================================================
    // FECHA Y HORARIO
    // =========================================================

    @NotNull(message = "La fecha del servicio es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;

    @NotNull(message = "La hora de inicio del servicio es obligatoria")
    @Column(nullable = false)
    private LocalTime hora;

    @NotNull(message = "La hora de finalización del servicio es obligatoria")
    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    // =========================================================
    // LUGAR
    // =========================================================

    @NotBlank(message = "El lugar del servicio es obligatorio")
    @Column(nullable = false)
    private String lugar;

    // =========================================================
    // COSTO
    // =========================================================

    @DecimalMin(
            value = "0.00",
            message = "El costo no puede ser negativo"
    )
    @Digits(
            integer = 8,
            fraction = 2,
            message = "El costo debe tener como máximo 8 dígitos enteros y 2 decimales"
    )
    @Column(
            precision = 10,
            scale = 2
    )
    private BigDecimal costo;

    // =========================================================
    // ESTADO
    // =========================================================

    private String estado;

    // =========================================================
    // AGENDA
    // =========================================================

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agenda_id", unique = true)
    @JsonIgnore
    private Agenda agenda;

    public Catering() {
    }

    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public ServicioCatering getServicioCatering() {
        return servicioCatering;
    }

    public String getTipoServicio() {
        return tipoServicio;
    }

    public Integer getNumeroAsistentes() {
        return numeroAsistentes;
    }

    public BigDecimal getPrecioPorPersona() {
        return precioPorPersona;
    }

    public String getMenu() {
        return menu;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public String getLugar() {
        return lugar;
    }

    public BigDecimal getCosto() {
        return costo;
    }

    public String getEstado() {
        return estado;
    }

    public Agenda getAgenda() {
        return agenda;
    }

    // =========================================================
    // SETTERS
    // =========================================================

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public void setServicioCatering(
            ServicioCatering servicioCatering) {

        this.servicioCatering = servicioCatering;
    }

    public void setTipoServicio(String tipoServicio) {
        this.tipoServicio = tipoServicio;
    }

    public void setNumeroAsistentes(Integer numeroAsistentes) {
        this.numeroAsistentes = numeroAsistentes;
    }

    public void setPrecioPorPersona(
            BigDecimal precioPorPersona) {

        this.precioPorPersona = precioPorPersona;
    }

    public void setMenu(String menu) {
        this.menu = menu;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public void setCosto(BigDecimal costo) {
        this.costo = costo;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setAgenda(Agenda agenda) {
        this.agenda = agenda;
    }
}