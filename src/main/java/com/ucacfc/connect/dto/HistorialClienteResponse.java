package com.ucacfc.connect.dto;

import com.ucacfc.connect.model.Alquiler;
import com.ucacfc.connect.model.Catering;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Cotizacion;
import com.ucacfc.connect.model.Inscripcion;
import com.ucacfc.connect.model.Pago;

import java.util.List;

public class HistorialClienteResponse {

    private Cliente cliente;
    private List<Inscripcion> inscripciones;
    private List<Cotizacion> cotizaciones;
    private List<Alquiler> alquileres;
    private List<Catering> catering;
    private List<Pago> pagos;

    public HistorialClienteResponse() {
    }

    public HistorialClienteResponse(
            Cliente cliente,
            List<Inscripcion> inscripciones,
            List<Cotizacion> cotizaciones,
            List<Alquiler> alquileres,
            List<Catering> catering,
            List<Pago> pagos) {

        this.cliente = cliente;
        this.inscripciones = inscripciones;
        this.cotizaciones = cotizaciones;
        this.alquileres = alquileres;
        this.catering = catering;
        this.pagos = pagos;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public List<Inscripcion> getInscripciones() {
        return inscripciones;
    }

    public void setInscripciones(List<Inscripcion> inscripciones) {
        this.inscripciones = inscripciones;
    }

    public List<Cotizacion> getCotizaciones() {
        return cotizaciones;
    }

    public void setCotizaciones(List<Cotizacion> cotizaciones) {
        this.cotizaciones = cotizaciones;
    }

    public List<Alquiler> getAlquileres() {
        return alquileres;
    }

    public void setAlquileres(List<Alquiler> alquileres) {
        this.alquileres = alquileres;
    }

    public List<Catering> getCatering() {
        return catering;
    }

    public void setCatering(List<Catering> catering) {
        this.catering = catering;
    }

    public List<Pago> getPagos() {
        return pagos;
    }

    public void setPagos(List<Pago> pagos) {
        this.pagos = pagos;
    }
}