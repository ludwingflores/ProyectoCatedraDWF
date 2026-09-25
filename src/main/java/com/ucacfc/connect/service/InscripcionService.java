package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Curso;
import com.ucacfc.connect.model.EstadoInscripcion;
import com.ucacfc.connect.model.Inscripcion;
import com.ucacfc.connect.repository.ClienteRepository;
import com.ucacfc.connect.repository.CursoRepository;
import com.ucacfc.connect.repository.InscripcionRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class InscripcionService {

    private static final List<EstadoInscripcion> ESTADOS_QUE_OCUPAN_CUPO = List.of(EstadoInscripcion.PENDIENTE, EstadoInscripcion.CONFIRMADA, EstadoInscripcion.FINALIZADA);

    private final InscripcionRepository repository;
    private final CursoRepository cursoRepository;
    private final ClienteRepository clienteRepository;

    public InscripcionService(InscripcionRepository repository, CursoRepository cursoRepository, ClienteRepository clienteRepository) {
        this.repository = repository;
        this.cursoRepository = cursoRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public List<Inscripcion> findAll(){
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Inscripcion findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Inscripcion no encontrada con id: " + id));
    }

    public Inscripcion save(Inscripcion entity) {
        validarInscripcion(entity, null);
        return repository.save(entity);
    }

    public Inscripcion update(Long id, Inscripcion entity) {
        Inscripcion current = findById(id);

        validarInscripcion(entity, current);

        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Inscripcion current = findById(id);
        repository.delete(current);
    }

    // Para validad la inscripción 
    private void validarInscripcion(Inscripcion incoming, Inscripcion current) {
        if (incoming.getCliente() == null || incoming.getCliente().getId() == null) {
            throw new IllegalArgumentException("Debe indicar un cliente válido");
        }

        if (incoming.getCurso() == null || incoming.getCurso().getId() == null) {
            throw new IllegalArgumentException("Debe indicar un curso válido");
        }

        if (incoming.getEstado() == null) {
            throw new IllegalArgumentException("Debe indicar el estado de la inscripción");
        }

        Long clienteId = incoming.getCliente().getId();
        Long cursoId = incoming.getCurso().getId();

        // Comprobar que el cliente exista y obtener sus datos completos.
        Cliente cliente = clienteRepository.findById(clienteId).orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + clienteId));

        // Comprobar que el curso exista y obtener sus datos completos.
        Curso curso = cursoRepository.findById(cursoId).orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + cursoId));

        // Usar las entidades recuperadas de la base de datos.
        incoming.setCliente(cliente);
        incoming.setCurso(curso);

        // Una inscripción cancelada no ocupa cupo ni bloquea
        // una nueva inscripción del mismo cliente.
        if (incoming.getEstado() == EstadoInscripcion.CANCELADA) {
            return;
        }

        boolean mismoClienteYCurso = current != null && current.getCliente().getId().equals(clienteId) && current.getCurso().getId().equals(cursoId);

        if (!mismoClienteYCurso && repository.existsByClienteIdAndCursoIdAndEstadoNot(clienteId, cursoId, EstadoInscripcion.CANCELADA)) {
            throw new IllegalArgumentException("El cliente ya tiene una inscripción no cancelada en este curso");
        }

        long cuposOcupados = repository.countByCursoIdAndEstadoIn(cursoId, ESTADOS_QUE_OCUPAN_CUPO);

        boolean yaOcupabaCupoEnEsteCurso = current != null && current.getCurso().getId().equals(cursoId) && ESTADOS_QUE_OCUPAN_CUPO.contains(current.getEstado());

        if (!yaOcupabaCupoEnEsteCurso && cuposOcupados >= curso.getCupoMaximo()) {
            throw new IllegalArgumentException("El curso no tiene cupos disponibles");
        }
    }

    private void copyFields(Inscripcion current, Inscripcion incoming) {
        current.setCliente(incoming.getCliente());
        current.setCurso(incoming.getCurso());
        current.setFecha(incoming.getFecha());
        current.setEstado(incoming.getEstado());
    }
}