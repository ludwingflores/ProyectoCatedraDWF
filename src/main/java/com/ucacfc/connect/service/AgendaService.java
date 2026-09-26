package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Espacio;
import com.ucacfc.connect.repository.AgendaRepository;

import java.util.List;

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

    public Agenda save(Agenda entity) {

        validarDatosAgenda(entity);

        Espacio espacio = espacioService.findById(
                entity.getEspacio().getId()
        );

        boolean existeConflicto = repository.existeConflicto(
                espacio.getId(),
                entity.getFecha(),
                entity.getHoraInicio(),
                entity.getHoraFin()
        );

        if (existeConflicto) {
            throw new IllegalArgumentException(
                    "El espacio ya se encuentra ocupado en la fecha y horario seleccionados"
            );
        }

        entity.setEspacio(espacio);

        return repository.save(entity);
    }

    public Agenda update(Long id, Agenda entity) {

        Agenda current = findById(id);

        validarDatosAgenda(entity);

        Espacio espacio = espacioService.findById(
                entity.getEspacio().getId()
        );

        boolean existeConflicto =
                repository.existeConflictoExcluyendoAgenda(
                        espacio.getId(),
                        entity.getFecha(),
                        entity.getHoraInicio(),
                        entity.getHoraFin(),
                        id
                );

        if (existeConflicto) {
            throw new IllegalArgumentException(
                    "El espacio ya se encuentra ocupado en la fecha y horario seleccionados"
            );
        }

        entity.setEspacio(espacio);

        copyFields(current, entity);

        return repository.save(current);
    }

    public void delete(Long id) {
        Agenda current = findById(id);
        repository.delete(current);
    }

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

        if (!agenda.getHoraInicio().isBefore(agenda.getHoraFin())) {
            throw new IllegalArgumentException(
                    "La hora de inicio debe ser anterior a la hora de finalización"
            );
        }

        if (agenda.getEspacio() == null
                || agenda.getEspacio().getId() == null) {

            throw new IllegalArgumentException(
                    "Debe seleccionar un espacio para la agenda"
            );
        }
    }

    private void copyFields(
            Agenda current,
            Agenda incoming) {

        current.setTitulo(incoming.getTitulo());
        current.setDescripcion(incoming.getDescripcion());
        current.setFecha(incoming.getFecha());
        current.setHoraInicio(incoming.getHoraInicio());
        current.setHoraFin(incoming.getHoraFin());
        current.setTipo(incoming.getTipo());
        current.setEspacio(incoming.getEspacio());
    }
}