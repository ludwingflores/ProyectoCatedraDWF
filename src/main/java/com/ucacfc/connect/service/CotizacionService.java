package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Catering;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Cotizacion;
import com.ucacfc.connect.model.Curso;
import com.ucacfc.connect.model.DetalleCotizacion;
import com.ucacfc.connect.model.Diplomado;
import com.ucacfc.connect.model.Espacio;
import com.ucacfc.connect.model.EstadoCotizacion;
import com.ucacfc.connect.repository.CotizacionRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CotizacionService {

    private final CotizacionRepository repository;
    private final ClienteService clienteService;
    private final CursoService cursoService;
    private final DiplomadoService diplomadoService;
    private final EspacioService espacioService;
    private final CateringService cateringService;

    public CotizacionService(
            CotizacionRepository repository,
            ClienteService clienteService,
            CursoService cursoService,
            DiplomadoService diplomadoService,
            EspacioService espacioService,
            CateringService cateringService) {

        this.repository = repository;
        this.clienteService = clienteService;
        this.cursoService = cursoService;
        this.diplomadoService = diplomadoService;
        this.espacioService = espacioService;
        this.cateringService = cateringService;
    }

    @Transactional(readOnly = true)
    public List<Cotizacion> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Cotizacion findById(Long id) {
            return repository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException(
                                            "Cotización no encontrada con id: " + id));
    }
    @Transactional(readOnly = true)
public List<Cotizacion> findAllByClienteCorreo(String correo) {
    return repository.findByClienteCorreoIgnoreCase(correo);
}

@Transactional(readOnly = true)
public Cotizacion findByIdAndClienteCorreo(Long id, String correo) {
    return repository.findByIdAndClienteCorreoIgnoreCase(id, correo)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Cotización no encontrada con id: " + id
                    )
            );
}

    public Cotizacion save(Cotizacion entity) {
        validarCliente(entity);
        prepararDetalles(entity);

        if (entity.getEstado() == null) {
            entity.setEstado(EstadoCotizacion.PENDIENTE);
        }

        return repository.save(entity);
    }

    public Cotizacion update(Long id, Cotizacion incoming) {
        Cotizacion current = findById(id);

        validarCliente(incoming);

        current.setCliente(incoming.getCliente());
        current.setFecha(incoming.getFecha());
        current.setDescripcion(incoming.getDescripcion());

        if (incoming.getEstado() != null) {
            current.setEstado(incoming.getEstado());
        }

        List<DetalleCotizacion> detalles = new ArrayList<>();

        if (incoming.getDetalles() != null) {
            detalles.addAll(incoming.getDetalles());
        }

        current.setDetalles(detalles);
        prepararDetalles(current);

        return repository.save(current);
    }

    public void delete(Long id) {
        Cotizacion current = findById(id);
        repository.delete(current);
    }

    private void validarCliente(Cotizacion cotizacion) {
        if (cotizacion.getCliente() == null ||
                cotizacion.getCliente().getId() == null) {

            throw new IllegalArgumentException(
                    "Debe indicar un cliente válido para la cotización"
            );
        }

        Cliente cliente = clienteService.findById(
                cotizacion.getCliente().getId()
        );

        cotizacion.setCliente(cliente);
    }

    private void prepararDetalles(Cotizacion cotizacion) {
        if (cotizacion.getDetalles() == null ||
                cotizacion.getDetalles().isEmpty()) {

            throw new IllegalArgumentException(
                    "La cotización debe contener al menos un servicio"
            );
        }

        BigDecimal total = BigDecimal.ZERO;

        for (DetalleCotizacion detalle : cotizacion.getDetalles()) {

            if (detalle.getTipoServicio() == null) {
                throw new IllegalArgumentException(
                        "El tipo de servicio es obligatorio"
                );
            }

            if (detalle.getServicioId() == null) {
                throw new IllegalArgumentException(
                        "La referencia del servicio es obligatoria"
                );
            }

            if (detalle.getCantidad() == null ||
                    detalle.getCantidad() < 1) {

                throw new IllegalArgumentException(
                        "La cantidad debe ser de al menos 1"
                );
            }

            BigDecimal precioUnitario =
                    obtenerPrecioServicio(detalle);

            BigDecimal subtotal = precioUnitario.multiply(
                    BigDecimal.valueOf(detalle.getCantidad())
            );

            detalle.setCotizacion(cotizacion);
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(subtotal);

            total = total.add(subtotal);
        }

        cotizacion.setMonto(total);
    }

    private BigDecimal obtenerPrecioServicio(
            DetalleCotizacion detalle) {

        return switch (detalle.getTipoServicio()) {

            case CURSO -> {
                Curso curso =
                        cursoService.findById(detalle.getServicioId());

                detalle.setDescripcion(
                        "Curso: " + curso.getNombre()
                );

                yield curso.getCosto();
            }

            case DIPLOMADO -> {
                Diplomado diplomado =
                        diplomadoService.findById(
                                detalle.getServicioId()
                        );

                detalle.setDescripcion(
                        "Diplomado: " + diplomado.getNombre()
                );

                yield diplomado.getCosto();
            }

            case ESPACIO -> {
                Espacio espacio =
                        espacioService.findById(
                                detalle.getServicioId()
                        );

                detalle.setDescripcion(
                        "Espacio: " + espacio.getNombre()
                );

                yield espacio.getPrecio();
            }

            case CATERING -> {
                Catering catering =
                        cateringService.findById(
                                detalle.getServicioId()
                        );

                if (catering.getCosto() == null) {
                    throw new IllegalArgumentException(
                            "El servicio de catering no tiene un costo definido"
                    );
                }

                detalle.setDescripcion(
                        "Catering: " + catering.getTipoServicio()
                );

                yield catering.getCosto();
            }
        };
    }
}