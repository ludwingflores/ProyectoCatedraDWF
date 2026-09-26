package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Catering;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.ServicioCatering;
import com.ucacfc.connect.repository.CateringRepository;
import com.ucacfc.connect.repository.ClienteRepository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CateringService {

    private final CateringRepository repository;
    private final ClienteRepository clienteRepository;
    private final ServicioCateringService servicioCateringService;

    public CateringService(
            CateringRepository repository,
            ClienteRepository clienteRepository,
            ServicioCateringService servicioCateringService) {

        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.servicioCateringService = servicioCateringService;
    }

    // =========================================================
    // CONSULTAS GENERALES
    // =========================================================

    @Transactional(readOnly = true)
    public List<Catering> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Catering findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Catering no encontrado con id: " + id
                        )
                );
    }

    // =========================================================
    // CONSULTAS DEL CLIENTE AUTENTICADO
    // =========================================================

    @Transactional(readOnly = true)
    public List<Catering> findAllByClienteCorreo(String correo) {
        return repository.findByClienteCorreoIgnoreCase(correo);
    }

    @Transactional(readOnly = true)
    public Catering findByIdAndClienteCorreo(
            Long id,
            String correo) {

        return repository
                .findByIdAndClienteCorreoIgnoreCase(id, correo)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Catering no encontrado con id: " + id
                        )
                );
    }

    // =========================================================
    // CREAR
    // =========================================================

    public Catering save(
            Catering entity,
            Authentication authentication) {

        boolean esCliente = authentication != null
                && authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_CLIENTE")
                        );

        if (esCliente) {

            String correo = authentication.getName();

            Cliente cliente = clienteRepository
                    .findByCorreoIgnoreCase(correo)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "No existe un cliente asociado al correo: "
                                            + correo
                            )
                    );

            // El cliente de la solicitud se obtiene del JWT.
            entity.setCliente(cliente);

            // Toda solicitud creada por CLIENTE inicia pendiente.
            entity.setEstado("PENDIENTE");

        } else {

            // ADMIN y RECEPCIONISTA deben indicar
            // para qué cliente registran la solicitud.
            validarCliente(entity);

            if (entity.getEstado() == null
                    || entity.getEstado().isBlank()) {

                entity.setEstado("PENDIENTE");
            }
        }

        // El servicio, tipo y precio se obtienen del catálogo.
        aplicarServicioCatering(entity);

        // El costo siempre se calcula en el servidor.
        calcularCosto(entity);

        return repository.save(entity);
    }

    // =========================================================
    // ACTUALIZAR
    // =========================================================

    public Catering update(
            Long id,
            Catering entity) {

        Catering current = findById(id);

        validarCliente(entity);

        // Antes de copiar, validamos el servicio seleccionado
        // y obtenemos sus datos reales desde el catálogo.
        aplicarServicioCatering(entity);

        copyFields(current, entity);

        // Nunca confiamos en un costo recibido en el JSON.
        calcularCosto(current);

        return repository.save(current);
    }

    // =========================================================
    // ELIMINAR
    // =========================================================

    public void delete(Long id) {

        Catering current = findById(id);

        repository.delete(current);
    }

    // =========================================================
    // VALIDAR CLIENTE
    // =========================================================

    private void validarCliente(Catering catering) {

        if (catering.getCliente() == null
                || catering.getCliente().getId() == null) {

            throw new IllegalArgumentException(
                    "El cliente es obligatorio"
            );
        }

        Cliente cliente = clienteRepository
                .findById(catering.getCliente().getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cliente no encontrado con id: "
                                        + catering.getCliente().getId()
                        )
                );

        catering.setCliente(cliente);
    }

    // =========================================================
    // APLICAR SERVICIO DE CATERING
    // =========================================================

    private void aplicarServicioCatering(Catering catering) {

        if (catering.getServicioCatering() == null
                || catering.getServicioCatering().getId() == null) {

            throw new IllegalArgumentException(
                    "El servicio de catering es obligatorio"
            );
        }

        ServicioCatering servicio =
                servicioCateringService.findActivoById(
                        catering.getServicioCatering().getId()
                );

        // Guardamos la relación con el catálogo.
        catering.setServicioCatering(servicio);

        // Estos campos funcionan como snapshot histórico.
        // Nunca se confía en valores enviados por el usuario.
        catering.setTipoServicio(servicio.getTipo());
        catering.setPrecioPorPersona(
                servicio.getPrecioPorPersona()
        );
    }

    // =========================================================
    // CALCULAR COSTO
    // =========================================================

    private void calcularCosto(Catering catering) {

        Integer numeroAsistentes =
                catering.getNumeroAsistentes();

        BigDecimal precioPorPersona =
                catering.getPrecioPorPersona();

        if (numeroAsistentes == null
                || numeroAsistentes < 1) {

            throw new IllegalArgumentException(
                    "El número de asistentes debe ser mayor que 0"
            );
        }

        if (precioPorPersona == null
                || precioPorPersona.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "El precio por persona debe ser mayor que 0"
            );
        }

        BigDecimal costoTotal =
                precioPorPersona.multiply(
                        BigDecimal.valueOf(numeroAsistentes)
                );

        catering.setCosto(costoTotal);
    }

    // =========================================================
    // COPIAR CAMPOS
    // =========================================================

    private void copyFields(
            Catering current,
            Catering incoming) {

        current.setCliente(incoming.getCliente());
        current.setServicioCatering(
                incoming.getServicioCatering()
        );

        // tipoServicio y precioPorPersona ya fueron
        // obtenidos del catálogo por aplicarServicioCatering().
        current.setTipoServicio(
                incoming.getTipoServicio()
        );
        current.setPrecioPorPersona(
                incoming.getPrecioPorPersona()
        );

        current.setNumeroAsistentes(
                incoming.getNumeroAsistentes()
        );
        current.setMenu(incoming.getMenu());
        current.setFecha(incoming.getFecha());
        current.setHora(incoming.getHora());
        current.setLugar(incoming.getLugar());
        current.setEstado(incoming.getEstado());

        // No copiamos incoming.getCosto().
        // Siempre se recalcula en el servidor.
    }
}