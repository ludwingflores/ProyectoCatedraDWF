package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.EstadoInscripcion;
import com.ucacfc.connect.model.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

        boolean existsByClienteIdAndCursoIdAndEstadoNot(
                        Long clienteId,
                        Long cursoId,
                        EstadoInscripcion estado);

        long countByCursoIdAndEstadoIn(
                        Long cursoId,
                        Collection<EstadoInscripcion> estados

        );

        List<Inscripcion> findByClienteIdOrderByFechaDesc(Long clienteId);
}
