package com.ucacfc.connect.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "agenda")
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título del evento es obligatorio")
    @Size(max = 150, message = "El título no puede superar los 150 caracteres")
    @Column(nullable = false, length = 150)
    private String titulo;

    // @Column(columnDefinition = "TEXT") le indica a hibernate que la columna de la BD debe usar el tipo de dato TEXT
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    @NotNull(message = "El tipo de evento es obligatorio")
    // TipoEvento es un Enum, le dice a java que guarde el ENUM como texto en la base de datos
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoEvento tipo;

    // Relacion de Muchos a uno con 'Espacio', muchas agendas pueden ser para un espacio
    // Hibernate puede traer inicialmente solo la informacion de la agenda, y con FetchType.LAZY le dice
    // que cargue el Espacio solo si realmente necesita la informacion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "espacio_id")
    // Hibernate utiliza objetos especiales para manejar relaciones LAZY, esos objetos pueden contener propiedades internas
    // @JsonIgnoreProperties evita que esas propiedades internas de Hibernate interfieran con el JSON
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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