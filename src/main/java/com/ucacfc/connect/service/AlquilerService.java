package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Alquiler;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Espacio;
import com.ucacfc.connect.model.EstadoAlquiler;
import com.ucacfc.connect.repository.AgendaRepository;
import com.ucacfc.connect.repository.AlquilerRepository;
import com.ucacfc.connect.repository.ClienteRepository;
import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.TipoEvento;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AlquilerService {

        private final AlquilerRepository repository;
        private final ClienteRepository clienteRepository;
        private final EspacioService espacioService;
        private final AgendaRepository agendaRepository;
        private final AgendaService agendaService;

        public AlquilerService(
                        AlquilerRepository repository,
                        ClienteRepository clienteRepository,
                        EspacioService espacioService,
                        AgendaRepository agendaRepository,
                        AgendaService agendaService) {

                this.repository = repository;
                this.clienteRepository = clienteRepository;
                this.espacioService = espacioService;
                this.agendaRepository = agendaRepository;
                this.agendaService = agendaService;
        }

        // =========================================================
        // CONSULTAS GENERALES
        // =========================================================

        @Transactional(readOnly = true)
        public List<Alquiler> findAll() {
                return repository.findAll();
        }

        @Transactional(readOnly = true)
        public Alquiler findById(Long id) {
                return repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Alquiler no encontrado con id: " + id));
        }

        // =========================================================
        // CONSULTAS DEL CLIENTE AUTENTICADO
        // =========================================================

        @Transactional(readOnly = true)
        public List<Alquiler> findAllByClienteCorreo(String correo) {
                return repository.findByClienteCorreoIgnoreCase(correo);
        }

        @Transactional(readOnly = true)
        public Alquiler findByIdAndClienteCorreo(
                        Long id,
                        String correo) {

                return repository
                                .findByIdAndClienteCorreoIgnoreCase(id, correo)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Alquiler no encontrado con id: " + id));
        }
        // =========================================================
// FILTROS + PAGINACIÓN + ORDENAMIENTO
// ADMINISTRACIÓN / RECEPCIÓN
// =========================================================

@Transactional(readOnly = true)
public Page<Alquiler> search(
        Long clienteId,
        Long espacioId,
        EstadoAlquiler estado,
        LocalDate fecha,
        int page,
        int size,
        String sortBy,
        String direction) {

    Sort sort = direction.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    PageRequest pageable =
            PageRequest.of(page, size, sort);

    if (clienteId != null) {
        return repository.findByClienteId(
                clienteId,
                pageable
        );
    }

    if (espacioId != null) {
        return repository.findByEspacioId(
                espacioId,
                pageable
        );
    }

    if (estado != null) {
        return repository.findByEstado(
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
public Page<Alquiler> searchByClienteCorreo(
        String correo,
        Long espacioId,
        EstadoAlquiler estado,
        LocalDate fecha,
        int page,
        int size,
        String sortBy,
        String direction) {

    Sort sort = direction.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    PageRequest pageable =
            PageRequest.of(page, size, sort);

    if (espacioId != null) {
        return repository
                .findByClienteCorreoIgnoreCaseAndEspacioId(
                        correo,
                        espacioId,
                        pageable
                );
    }

    if (estado != null) {
        return repository
                .findByClienteCorreoIgnoreCaseAndEstado(
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
        // CONSULTAR DISPONIBILIDAD - RF09
        // =========================================================

        @Transactional(readOnly = true)
        public boolean estaDisponible(
                        Long espacioId,
                        LocalDate fecha,
                        LocalTime horaInicio,
                        LocalTime horaFin) {

                validarHorario(fecha, horaInicio, horaFin);

                Espacio espacio = espacioService.findById(espacioId);

                if (!Boolean.TRUE.equals(espacio.getDisponible())) {
                        return false;
                }

                boolean conflictoAlquiler = repository.existeConflicto(
                                espacioId,
                                fecha,
                                horaInicio,
                                horaFin);

                boolean conflictoAgenda = agendaRepository.existeConflicto(
                                espacioId,
                                fecha,
                                horaInicio,
                                horaFin);

                return !conflictoAlquiler && !conflictoAgenda;
        }

        // =========================================================
        // CREAR - RF07
        // =========================================================

        public Alquiler save(
                        Alquiler entity,
                        Authentication authentication) {

                validarHorario(
                                entity.getFecha(),
                                entity.getHoraInicio(),
                                entity.getHoraFin());

                asignarCliente(entity, authentication);

                Espacio espacio = validarEspacio(
                                entity.getEspacio());

                validarDisponibilidad(
                                espacio,
                                entity.getFecha(),
                                entity.getHoraInicio(),
                                entity.getHoraFin(),
                                null);

                entity.setEspacio(espacio);

                // El precio siempre proviene del catálogo de espacios.
                entity.setPrecio(espacio.getPrecio());

                boolean esCliente = esCliente(authentication);

                if (esCliente) {
                        entity.setEstado(EstadoAlquiler.PENDIENTE);
                } else if (entity.getEstado() == null) {
                        entity.setEstado(EstadoAlquiler.PENDIENTE);
                }

                // Si el alquiler no está cancelado, se registra también
                // en la Agenda Institucional.
                if (entity.getEstado() != EstadoAlquiler.CANCELADO) {

                        Agenda agenda = new Agenda();

                        agenda.setTitulo(
                                        "Alquiler - " + espacio.getNombre());

                        agenda.setDescripcion(
                                        "Alquiler registrado para "
                                                        + entity.getCliente().getNombre());

                        agenda.setFecha(entity.getFecha());
                        agenda.setHoraInicio(entity.getHoraInicio());
                        agenda.setHoraFin(entity.getHoraFin());
                        agenda.setTipo(TipoEvento.ALQUILER);
                        agenda.setEspacio(espacio);

                        Agenda agendaGuardada = agendaService.save(agenda);

                        entity.setAgenda(agendaGuardada);
                }

                return repository.save(entity);
        }

        // =========================================================
        // ACTUALIZAR
        // =========================================================

        public Alquiler update(
                        Long id,
                        Alquiler entity) {

                Alquiler current = findById(id);

                validarHorario(
                                entity.getFecha(),
                                entity.getHoraInicio(),
                                entity.getHoraFin());

                validarCliente(entity);

                Espacio espacio = validarEspacio(
                                entity.getEspacio());

                if (!Boolean.TRUE.equals(espacio.getDisponible())) {
                        throw new IllegalArgumentException(
                                        "El espacio seleccionado no está disponible");
                }

                // Verificar conflictos con otros alquileres,
                // excluyendo el alquiler que estamos modificando.
                boolean conflictoAlquiler = repository.existeConflictoExcluyendoAlquiler(
                                espacio.getId(),
                                entity.getFecha(),
                                entity.getHoraInicio(),
                                entity.getHoraFin(),
                                id);

                if (conflictoAlquiler) {
                        throw new IllegalArgumentException(
                                        "El espacio ya posee un alquiler en la fecha y horario seleccionados");
                }

                Agenda agendaActual = current.getAgenda();

                // ---------------------------------------------------------
                // ALQUILER CANCELADO
                // ---------------------------------------------------------
                // Un alquiler cancelado deja de bloquear el espacio.
                if (entity.getEstado() == EstadoAlquiler.CANCELADO) {

                        if (agendaActual != null) {
                                current.setAgenda(null);
                                agendaService.delete(agendaActual.getId());
                        }

                } else {

                        // -----------------------------------------------------
                        // CREAR AGENDA SI EL ALQUILER NO TENÍA UNA
                        // -----------------------------------------------------
                        if (agendaActual == null) {

                                // Como no existe una agenda propia que excluir,
                                // comprobamos cualquier ocupación institucional.
                                boolean conflictoAgenda = agendaRepository.existeConflicto(
                                                espacio.getId(),
                                                entity.getFecha(),
                                                entity.getHoraInicio(),
                                                entity.getHoraFin());

                                if (conflictoAgenda) {
                                        throw new IllegalArgumentException(
                                                        "El espacio ya se encuentra ocupado en la agenda institucional");
                                }

                                Agenda nuevaAgenda = new Agenda();

                                nuevaAgenda.setTitulo(
                                                "Alquiler - " + espacio.getNombre());

                                nuevaAgenda.setDescripcion(
                                                "Alquiler registrado para "
                                                                + entity.getCliente().getNombre());

                                nuevaAgenda.setFecha(entity.getFecha());
                                nuevaAgenda.setHoraInicio(entity.getHoraInicio());
                                nuevaAgenda.setHoraFin(entity.getHoraFin());
                                nuevaAgenda.setTipo(TipoEvento.ALQUILER);
                                nuevaAgenda.setEspacio(espacio);

                                current.setAgenda(
                                                agendaService.save(nuevaAgenda));

                        } else {

                                // -------------------------------------------------
                                // ACTUALIZAR LA AGENDA EXISTENTE
                                // -------------------------------------------------
                                // AgendaService.update excluye su propio registro al
                                // comprobar conflictos, evitando que choque consigo misma.

                                Agenda agendaActualizada = new Agenda();

                                agendaActualizada.setTitulo(
                                                "Alquiler - " + espacio.getNombre());

                                agendaActualizada.setDescripcion(
                                                "Alquiler registrado para "
                                                                + entity.getCliente().getNombre());

                                agendaActualizada.setFecha(entity.getFecha());
                                agendaActualizada.setHoraInicio(entity.getHoraInicio());
                                agendaActualizada.setHoraFin(entity.getHoraFin());
                                agendaActualizada.setTipo(TipoEvento.ALQUILER);
                                agendaActualizada.setEspacio(espacio);

                                agendaService.update(
                                                agendaActual.getId(),
                                                agendaActualizada);
                        }
                }

                entity.setEspacio(espacio);

                // El precio se vuelve a tomar del catálogo del espacio.
                entity.setPrecio(espacio.getPrecio());

                copyFields(current, entity);

                return repository.save(current);
        }

        // =========================================================
        // ELIMINAR
        // =========================================================

      public void delete(Long id) {

    Alquiler current = findById(id);

    Agenda agenda = current.getAgenda();

    // Primero quitamos la relación para evitar problemas
    // con la clave foránea alquiler.agenda_id.
    if (agenda != null) {
        current.setAgenda(null);
        repository.save(current);
        agendaService.delete(agenda.getId());
    }

    repository.delete(current);
}

        // =========================================================
        // CLIENTE
        // =========================================================

        private void asignarCliente(
                        Alquiler alquiler,
                        Authentication authentication) {

                if (esCliente(authentication)) {

                        String correo = authentication.getName();

                        Cliente cliente = clienteRepository
                                        .findByCorreoIgnoreCase(correo)
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "No existe un cliente asociado al correo: "
                                                                        + correo));

                        alquiler.setCliente(cliente);

                } else {
                        validarCliente(alquiler);
                }
        }

        private void validarCliente(Alquiler alquiler) {

                if (alquiler.getCliente() == null
                                || alquiler.getCliente().getId() == null) {

                        throw new IllegalArgumentException(
                                        "El cliente es obligatorio");
                }

                Cliente cliente = clienteRepository
                                .findById(alquiler.getCliente().getId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cliente no encontrado con id: "
                                                                + alquiler.getCliente().getId()));

                alquiler.setCliente(cliente);
        }

        private boolean esCliente(Authentication authentication) {

                return authentication != null
                                && authentication.getAuthorities()
                                                .stream()
                                                .anyMatch(authority -> authority.getAuthority()
                                                                .equals("ROLE_CLIENTE"));
        }

        // =========================================================
        // ESPACIO Y DISPONIBILIDAD
        // =========================================================

        private Espacio validarEspacio(Espacio espacioRecibido) {

                if (espacioRecibido == null
                                || espacioRecibido.getId() == null) {

                        throw new IllegalArgumentException(
                                        "El espacio es obligatorio");
                }

                return espacioService.findById(
                                espacioRecibido.getId());
        }

        private void validarDisponibilidad(
                        Espacio espacio,
                        LocalDate fecha,
                        LocalTime horaInicio,
                        LocalTime horaFin,
                        Long alquilerId) {

                if (!Boolean.TRUE.equals(espacio.getDisponible())) {
                        throw new IllegalArgumentException(
                                        "El espacio seleccionado no está disponible");
                }

                boolean conflictoAlquiler;

                if (alquilerId == null) {

                        conflictoAlquiler = repository.existeConflicto(
                                        espacio.getId(),
                                        fecha,
                                        horaInicio,
                                        horaFin);

                } else {

                        conflictoAlquiler = repository.existeConflictoExcluyendoAlquiler(
                                        espacio.getId(),
                                        fecha,
                                        horaInicio,
                                        horaFin,
                                        alquilerId);
                }

                if (conflictoAlquiler) {
                        throw new IllegalArgumentException(
                                        "El espacio ya posee un alquiler en la fecha y horario seleccionados");
                }

                boolean conflictoAgenda = agendaRepository.existeConflicto(
                                espacio.getId(),
                                fecha,
                                horaInicio,
                                horaFin);

                if (conflictoAgenda) {
                        throw new IllegalArgumentException(
                                        "El espacio ya se encuentra ocupado en la agenda institucional");
                }
        }

        // =========================================================
        // HORARIO
        // =========================================================

        private void validarHorario(
                        LocalDate fecha,
                        LocalTime horaInicio,
                        LocalTime horaFin) {

                if (fecha == null) {
                        throw new IllegalArgumentException(
                                        "La fecha del alquiler es obligatoria");
                }

                if (horaInicio == null) {
                        throw new IllegalArgumentException(
                                        "La hora de inicio es obligatoria");
                }

                if (horaFin == null) {
                        throw new IllegalArgumentException(
                                        "La hora de finalización es obligatoria");
                }

                if (!horaInicio.isBefore(horaFin)) {
                        throw new IllegalArgumentException(
                                        "La hora de inicio debe ser anterior a la hora de finalización");
                }
        }

        // =========================================================
        // COPIAR CAMPOS
        // =========================================================

        private void copyFields(
                        Alquiler current,
                        Alquiler incoming) {

                current.setCliente(incoming.getCliente());
                current.setEspacio(incoming.getEspacio());
                current.setFecha(incoming.getFecha());
                current.setHoraInicio(incoming.getHoraInicio());
                current.setHoraFin(incoming.getHoraFin());
                current.setPrecio(incoming.getPrecio());
                current.setEstado(incoming.getEstado());
        }
}