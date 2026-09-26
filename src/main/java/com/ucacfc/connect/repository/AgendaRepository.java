package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Agenda;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AgendaRepository extends JpaRepository<Agenda, Long> {

    /*
     * Comprueba si existe otra agenda que utilice el mismo espacio,
     * en la misma fecha y cuyo horario se cruce con el solicitado.
     *
     * Existe conflicto cuando:
     *
     * nuevaHoraInicio < horaFinExistente
     * &&
     * nuevaHoraFin > horaInicioExistente
     */
    @Query("""
            SELECT COUNT(a) > 0
            FROM Agenda a
            WHERE a.espacio.id = :espacioId
              AND a.fecha = :fecha
              AND a.horaInicio < :horaFin
              AND a.horaFin > :horaInicio
            """)
    boolean existeConflicto(
            @Param("espacioId") Long espacioId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    /*
     * Se utiliza al actualizar una agenda.
     * Ignora el registro que se está modificando para que
     * la agenda no entre en conflicto consigo misma.
     */
    @Query("""
            SELECT COUNT(a) > 0
            FROM Agenda a
            WHERE a.espacio.id = :espacioId
              AND a.fecha = :fecha
              AND a.horaInicio < :horaFin
              AND a.horaFin > :horaInicio
              AND a.id <> :agendaId
            """)
    boolean existeConflictoExcluyendoAgenda(
            @Param("espacioId") Long espacioId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("agendaId") Long agendaId
    );
}