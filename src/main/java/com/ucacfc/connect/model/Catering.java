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

    @NotNull(message = "El cliente es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cliente cliente;

    @NotBlank(message = "El tipo de servicio es obligatorio")
    @Size(max = 100, message = "El tipo de servicio no puede superar los 100 caracteres")
    @Column(name = "tipo_servicio", nullable = false, length = 100)
    private String tipoServicio;

    @NotNull(message = "El número de asistentes es obligatorio")
    @Min(value = 1, message = "Debe haber al menos 1 asistente")
    @Column(name = "numero_asistentes", nullable = false)
    private Integer numeroAsistentes;

    @Column(columnDefinition = "TEXT")
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

    @DecimalMin(value = "0.00", message = "El costo no puede ser negativo")
    @Digits(integer = 8, fraction = 2,
            message = "El costo debe tener como máximo 8 dígitos enteros y 2 decimales")
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