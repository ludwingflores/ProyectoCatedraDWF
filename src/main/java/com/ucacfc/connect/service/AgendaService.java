package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Espacio;
import com.ucacfc.connect.model.TipoEvento;
import com.ucacfc.connect.repository.AgendaRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AgendaService {

    private final AgendaRepository repository;
    private final EspacioService espacioService;

    public AgendaService(
            AgendaRepository repository,
            EspacioService espacioService) {

        this.repository = repository;
        this.espacioService = espacioService;
    }

    // =========================================================
    // CONSULTAS GENERALES
    // =========================================================

    @Transactional(readOnly = true)
    public List<Agenda> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Agenda findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Agenda no encontrada con id: " + id
                        )
                );
    }

    // =========================================================
    // FILTROS + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @Transactional(readOnly = true)
    public Page<Agenda> search(
            String titulo,
            LocalDate fecha,
            TipoEvento tipo,
            Long espacioId,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable =
                PageRequest.of(page, size, sort);

        if (titulo != null && !titulo.isBlank()) {
            return repository.findByTituloContainingIgnoreCase(
                    titulo,
                    pageable
            );
        }

        if (fecha != null) {
            return repository.findByFecha(
                    fecha,
                    pageable
            );
        }

        if (tipo != null) {
            return repository.findByTipo(
                    tipo,
                    pageable
            );
        }

        if (espacioId != null) {
            return repository.findByEspacioId(
                    espacioId,
                    pageable
            );
        }

        return repository.findAll(pageable);
    }

    // =========================================================
    // CREAR
    // =========================================================

    public Agenda save(Agenda entity) {

        validarDatosAgenda(entity);

        prepararEspacioYValidarConflicto(
                entity,
                null
        );

        return repository.save(entity);
    }

    // =========================================================
    // ACTUALIZAR
    // =========================================================

    public Agenda update(Long id, Agenda entity) {

        Agenda current = findById(id);

        validarDatosAgenda(entity);

        prepararEspacioYValidarConflicto(
                entity,
                id
        );

        copyFields(current, entity);

        return repository.save(current);
    }

    // =========================================================
    // ELIMINAR
    // =========================================================

    public void delete(Long id) {

        Agenda current = findById(id);

        repository.delete(current);
    }

    // =========================================================
    // VALIDACIONES GENERALES
    // =========================================================

    private void validarDatosAgenda(Agenda agenda) {

        if (agenda.getFecha() == null) {
            throw new IllegalArgumentException(
                    "La fecha de la agenda es obligatoria"
            );
        }

        if (agenda.getHoraInicio() == null) {
            throw new IllegalArgumentException(
                    "La hora de inicio es obligatoria"
            );
        }

        if (agenda.getHoraFin() == null) {
            throw new IllegalArgumentException(
                    "La hora de finalización es obligatoria"
            );
        }

        if (!agenda.getHoraInicio()
                .isBefore(agenda.getHoraFin())) {

            throw new IllegalArgumentException(
                    "La hora de inicio debe ser anterior a la hora de finalización"
            );
        }

        if (agenda.getTipo() == null) {
            throw new IllegalArgumentException(
                    "El tipo de evento es obligatorio"
            );
        }
    }

    // =========================================================
    // ESPACIO + CONFLICTOS
    // =========================================================

    private void prepararEspacioYValidarConflicto(
            Agenda agenda,
            Long agendaIdExcluir) {

        /*
         * El espacio es opcional.
         *
         * Esto permite registrar en la agenda institucional
         * actividades que no utilizan un espacio físico.
         *
         * Cuando sí existe un espacio, se valida que sea un
         * espacio real del sistema y que no exista solapamiento
         * de horario.
         */
        if (agenda.getEspacio() == null) {
            return;
        }

        if (agenda.getEspacio().getId() == null) {
            throw new IllegalArgumentException(
                    "El espacio seleccionado debe tener un id"
            );
        }

        Espacio espacio = espacioService.findById(
                agenda.getEspacio().getId()
        );

        boolean existeConflicto;

        if (agendaIdExcluir == null) {

            existeConflicto = repository.existeConflicto(
                    espacio.getId(),
                    agenda.getFecha(),
                    agenda.getHoraInicio(),
                    agenda.getHoraFin()
            );

        } else {

            existeConflicto =
                    repository.existeConflictoExcluyendoAgenda(
                            espacio.getId(),
                            agenda.getFecha(),
                            agenda.getHoraInicio(),
                            agenda.getHoraFin(),
                            agendaIdExcluir
                    );
        }

        if (existeConflicto) {
            throw new IllegalArgumentException(
                    "El espacio ya se encuentra ocupado en la fecha y horario seleccionados"
            );
        }

        agenda.setEspacio(espacio);
    }

    // =========================================================
    // COPIAR CAMPOS
    // =========================================================

    private void copyFields(
            Agenda current,
            Agenda incoming) {

        current.setTitulo(
                incoming.getTitulo()
        );

        current.setDescripcion(
                incoming.getDescripcion()
        );

        current.setFecha(
                incoming.getFecha()
        );

        current.setHoraInicio(
                incoming.getHoraInicio()
        );

        current.setHoraFin(
                incoming.getHoraFin()
        );

        current.setTipo(
                incoming.getTipo()
        );

        current.setEspacio(
                incoming.getEspacio()
        );
    }
}