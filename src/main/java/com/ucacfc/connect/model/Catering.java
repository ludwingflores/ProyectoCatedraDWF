package com.ucacfc.connect.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "catering")
public class Catering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // La relación sigue siendo obligatoria en la entidad y en la BD.
    // No usamos @NotNull aquí porque, cuando quien crea la solicitud
    // es un CLIENTE, CateringService obtiene el cliente desde el JWT.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Cliente cliente;
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "servicio_catering_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private ServicioCatering servicioCatering;
    @Column(name = "tipo_servicio", nullable = false, length = 100)
    private String tipoServicio;

    @NotNull(message = "El número de asistentes es obligatorio")
    @Min(value = 1, message = "Debe haber al menos 1 asistente")
    @Column(name = "numero_asistentes", nullable = false)
    private Integer numeroAsistentes;

    @Column(name = "precio_por_persona", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioPorPersona;

    @NotBlank(message = "El menú es obligatorio")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String menu;

    @NotNull(message = "La fecha del servicio es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;

    @NotNull(message = "La hora del servicio es obligatoria")
    @Column(nullable = false)
    private LocalTime hora;

    @NotBlank(message = "El lugar del servicio es obligatorio")
    @Column(nullable = false)
    private String lugar;

    // El costo total es calculado por CateringService:
    // precioPorPersona * numeroAsistentes.
    // Nunca se confía en un costo enviado por el cliente.
    @DecimalMin(value = "0.00", message = "El costo no puede ser negativo")
    @Digits(integer = 8, fraction = 2, message = "El costo debe tener como máximo 8 dígitos enteros y 2 decimales")
    @Column(precision = 10, scale = 2)
    private BigDecimal costo;

    private String estado;

    public Catering() {
    }

    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public ServicioCatering getServicioCatering() {
        return servicioCatering;
    }

    public Cliente getCliente() {
        return cliente;
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

    public String getLugar() {
        return lugar;
    }

    public BigDecimal getCosto() {
        return costo;
    }

    public String getEstado() {
        return estado;
    }

    // =========================================================
    // SETTERS
    // =========================================================

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public void setTipoServicio(String tipoServicio) {
        this.tipoServicio = tipoServicio;
    }

    public void setNumeroAsistentes(Integer numeroAsistentes) {
        this.numeroAsistentes = numeroAsistentes;
    }

    public void setPrecioPorPersona(BigDecimal precioPorPersona) {
        this.precioPorPersona = precioPorPersona;
    }

    public void setServicioCatering(ServicioCatering servicioCatering) {
        this.servicioCatering = servicioCatering;
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

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public void setCosto(BigDecimal costo) {
        this.costo = costo;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}