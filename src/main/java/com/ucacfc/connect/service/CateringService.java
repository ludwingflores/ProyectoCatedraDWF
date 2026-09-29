package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Catering;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.ServicioCatering;
import com.ucacfc.connect.model.TipoEvento;
import com.ucacfc.connect.repository.AgendaRepository;
import com.ucacfc.connect.repository.CateringRepository;
import com.ucacfc.connect.repository.ClienteRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CateringService {

    private final CateringRepository repository;
    private final ClienteRepository clienteRepository;
    private final ServicioCateringService servicioCateringService;
    private final AgendaRepository agendaRepository;
    private final AgendaService agendaService;

    public CateringService(
            CateringRepository repository,
            ClienteRepository clienteRepository,
            ServicioCateringService servicioCateringService,
            AgendaRepository agendaRepository,
            AgendaService agendaService) {

        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.servicioCateringService = servicioCateringService;
        this.agendaRepository = agendaRepository;
        this.agendaService = agendaService;
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
    public List<Catering> findAllByClienteCorreo(
            String correo) {

        return repository.findByClienteCorreoIgnoreCase(
                correo
        );
    }

    @Transactional(readOnly = true)
    public Catering findByIdAndClienteCorreo(
            Long id,
            String correo) {

        return repository
                .findByIdAndClienteCorreoIgnoreCase(
                        id,
                        correo
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Catering no encontrado con id: " + id
                        )
                );
    }

    // =========================================================
    // FILTROS + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @Transactional(readOnly = true)
    public Page<Catering> search(
            Long clienteId,
            Long servicioCateringId,
            String tipoServicio,
            String estado,
            LocalDate fecha,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable =
                PageRequest.of(
                        page,
                        size,
                        sort
                );

        if (clienteId != null) {

            return repository.findByClienteId(
                    clienteId,
                    pageable
            );
        }

        if (servicioCateringId != null) {

            return repository.findByServicioCateringId(
                    servicioCateringId,
                    pageable
            );
        }

        if (tipoServicio != null
                && !tipoServicio.isBlank()) {

            return repository
                    .findByTipoServicioContainingIgnoreCase(
                            tipoServicio,
                            pageable
                    );
        }

        if (estado != null
                && !estado.isBlank()) {

            return repository.findByEstadoIgnoreCase(
                    estado,
                    pageable
            );
        }

        if (fecha != null) {

            return repository.findByFecha(
                    fecha,
                    pageable
            );
        }

        return repository.findAll(pageable);
    }

    // =========================================================
    // FILTROS DEL CLIENTE AUTENTICADO
    // =========================================================

    @Transactional(readOnly = true)
    public Page<Catering> searchByClienteCorreo(
            String correo,
            Long servicioCateringId,
            String tipoServicio,
            String estado,
            LocalDate fecha,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable =
                PageRequest.of(
                        page,
                        size,
                        sort
                );

        if (servicioCateringId != null) {

            return repository
                    .findByClienteCorreoIgnoreCaseAndServicioCateringId(
                            correo,
                            servicioCateringId,
                            pageable
                    );
        }

        if (tipoServicio != null
                && !tipoServicio.isBlank()) {

            return repository
                    .findByClienteCorreoIgnoreCaseAndTipoServicioContainingIgnoreCase(
                            correo,
                            tipoServicio,
                            pageable
                    );
        }

        if (estado != null
                && !estado.isBlank()) {

            return repository
                    .findByClienteCorreoIgnoreCaseAndEstadoIgnoreCase(
                            correo,
                            estado,
                            pageable
                    );
        }

        if (fecha != null) {

            return repository
                    .findByClienteCorreoIgnoreCaseAndFecha(
                            correo,
                            fecha,
                            pageable
                    );
        }

        return repository.findByClienteCorreoIgnoreCase(
                correo,
                pageable
        );
    }

    // =========================================================
    // CREAR
    // =========================================================

    public Catering save(
            Catering entity,
            Authentication authentication) {

        validarHorario(entity);

        boolean esCliente =
                authentication != null
                        && authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_CLIENTE")
                        );

        if (esCliente) {

            String correo =
                    authentication.getName();

            Cliente cliente =
                    clienteRepository
                            .findByCorreoIgnoreCase(correo)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "No existe un cliente asociado al correo: "
                                                    + correo
                                    )
                            );

            // El cliente se obtiene del JWT.
            entity.setCliente(cliente);

            // Toda solicitud de cliente inicia pendiente.
            entity.setEstado("PENDIENTE");

        } else {

            validarCliente(entity);

            if (entity.getEstado() == null
                    || entity.getEstado().isBlank()) {

                entity.setEstado("PENDIENTE");
            }
        }

        // Servicio y precio vienen del catálogo.
        aplicarServicioCatering(entity);

        // El costo se calcula en servidor.
        calcularCosto(entity);

        // Guardamos primero el Catering.
        Catering saved =
                repository.save(entity);

        // Creamos su entrada en Agenda.
        Agenda agenda =
                crearAgendaDesdeCatering(saved);

        agenda = agendaService
                .save(agenda);

        // Vinculamos ambos registros.
        saved.setAgenda(agenda);

        return repository.save(saved);
    }

    // =========================================================
    // ACTUALIZAR
    // =========================================================

    public Catering update(
            Long id,
            Catering entity) {

        validarHorario(entity);

        Catering current =
                findById(id);

        validarCliente(entity);

        aplicarServicioCatering(entity);

        copyFields(
                current,
                entity
        );

        calcularCosto(current);

        // Actualizar Agenda existente.
        if (current.getAgenda() != null) {

            Agenda agenda =
                    current.getAgenda();

            actualizarAgendaDesdeCatering(
                    agenda,
                    current
            );

            agendaRepository.save(agenda);

        } else {

            // Compatibilidad con registros antiguos
            // que todavía no tenían Agenda.
            Agenda agenda =
                    crearAgendaDesdeCatering(current);

            agenda =
                    agendaService.save(agenda);

            current.setAgenda(agenda);
        }

        return repository.save(current);
    }

    // =========================================================
    // ELIMINAR
    // =========================================================

    public void delete(Long id) {

        Catering current =
                findById(id);

        Agenda agenda =
                current.getAgenda();

        if (agenda != null) {

            current.setAgenda(null);

            repository.save(current);

            agendaRepository.delete(agenda);
        }

        repository.delete(current);
    }

    // =========================================================
    // CREAR AGENDA DESDE CATERING
    // =========================================================

    private Agenda crearAgendaDesdeCatering(
            Catering catering) {

        Agenda agenda =
                new Agenda();

        agenda.setTitulo(
                "Catering - "
                        + catering.getTipoServicio()
        );

        agenda.setDescripcion(
                "Servicio de catering para "
                        + catering.getNumeroAsistentes()
                        + " asistentes. Lugar: "
                        + catering.getLugar()
        );

        agenda.setFecha(
                catering.getFecha()
        );

        agenda.setHoraInicio(
                catering.getHora()
        );

        agenda.setHoraFin(
                catering.getHoraFin()
        );

        agenda.setTipo(
                TipoEvento.CATERING
        );

        // Catering no utiliza espacio_id.
        agenda.setEspacio(null);

        return agenda;
    }

    // =========================================================
    // ACTUALIZAR AGENDA DESDE CATERING
    // =========================================================

    private void actualizarAgendaDesdeCatering(
            Agenda agenda,
            Catering catering) {

        agenda.setTitulo(
                "Catering - "
                        + catering.getTipoServicio()
        );

        agenda.setDescripcion(
                "Servicio de catering para "
                        + catering.getNumeroAsistentes()
                        + " asistentes. Lugar: "
                        + catering.getLugar()
        );

        agenda.setFecha(
                catering.getFecha()
        );

        agenda.setHoraInicio(
                catering.getHora()
        );

        agenda.setHoraFin(
                catering.getHoraFin()
        );

        agenda.setTipo(
                TipoEvento.CATERING
        );

        agenda.setEspacio(null);
    }

    // =========================================================
    // VALIDAR HORARIO
    // =========================================================

    private void validarHorario(
            Catering catering) {

        if (catering.getFecha() == null) {

            throw new IllegalArgumentException(
                    "La fecha del servicio es obligatoria"
            );
        }

        if (catering.getHora() == null) {

            throw new IllegalArgumentException(
                    "La hora de inicio del servicio es obligatoria"
            );
        }

        if (catering.getHoraFin() == null) {

            throw new IllegalArgumentException(
                    "La hora de finalización del servicio es obligatoria"
            );
        }

        if (!catering.getHora()
                .isBefore(catering.getHoraFin())) {

            throw new IllegalArgumentException(
                    "La hora de inicio debe ser anterior a la hora de finalización"
            );
        }
    }

    // =========================================================
    // VALIDAR CLIENTE
    // =========================================================

    private void validarCliente(
            Catering catering) {

        if (catering.getCliente() == null
                || catering.getCliente().getId() == null) {

            throw new IllegalArgumentException(
                    "El cliente es obligatorio"
            );
        }

        Cliente cliente =
                clienteRepository
                        .findById(
                                catering
                                        .getCliente()
                                        .getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cliente no encontrado con id: "
                                                + catering
                                                .getCliente()
                                                .getId()
                                )
                        );

        catering.setCliente(cliente);
    }

    // =========================================================
    // APLICAR SERVICIO DE CATERING
    // =========================================================

    private void aplicarServicioCatering(
            Catering catering) {

        if (catering.getServicioCatering() == null
                || catering
                        .getServicioCatering()
                        .getId() == null) {

            throw new IllegalArgumentException(
                    "El servicio de catering es obligatorio"
            );
        }

        ServicioCatering servicio =
                servicioCateringService
                        .findActivoById(
                                catering
                                        .getServicioCatering()
                                        .getId()
                        );

        catering.setServicioCatering(
                servicio
        );

        catering.setTipoServicio(
                servicio.getTipo()
        );

        catering.setPrecioPorPersona(
                servicio.getPrecioPorPersona()
        );
    }

    // =========================================================
    // CALCULAR COSTO
    // =========================================================

    private void calcularCosto(
            Catering catering) {

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
                || precioPorPersona.compareTo(
                        BigDecimal.ZERO
                ) <= 0) {

            throw new IllegalArgumentException(
                    "El precio por persona debe ser mayor que 0"
            );
        }

        BigDecimal costoTotal =
                precioPorPersona.multiply(
                        BigDecimal.valueOf(
                                numeroAsistentes
                        )
                );

        catering.setCosto(
                costoTotal
        );
    }

    // =========================================================
    // COPIAR CAMPOS
    // =========================================================

    private void copyFields(
            Catering current,
            Catering incoming) {

        current.setCliente(
                incoming.getCliente()
        );

        current.setServicioCatering(
                incoming.getServicioCatering()
        );

        current.setTipoServicio(
                incoming.getTipoServicio()
        );

        current.setPrecioPorPersona(
                incoming.getPrecioPorPersona()
        );

        current.setNumeroAsistentes(
                incoming.getNumeroAsistentes()
        );

        current.setMenu(
                incoming.getMenu()
        );

        current.setFecha(
                incoming.getFecha()
        );

        current.setHora(
                incoming.getHora()
        );

        current.setHoraFin(
                incoming.getHoraFin()
        );

        current.setLugar(
                incoming.getLugar()
        );

        current.setEstado(
                incoming.getEstado()
        );

        // El costo NO se copia.
        // Se recalcula en el servidor.
    }
}