package com.ucacfc.connect.service;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Espacio;
import com.ucacfc.connect.model.TipoEvento;
import com.ucacfc.connect.repository.AgendaRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class AgendaServiceTest {

    @Mock
    private AgendaRepository repository;

    @Mock
    private EspacioService espacioService;

    @InjectMocks
    private AgendaService agendaService;

    private Agenda agenda;
    private Espacio espacio;

    @BeforeEach
    void setUp() {

        espacio = new Espacio();

        /*
         * Espacio no expone setId().
         * Para este primer test utilizamos una agenda sin espacio,
         * ya que AgendaService permite eventos institucionales
         * que no requieren espacio físico.
         */
        agenda = new Agenda();
        agenda.setTitulo("Evento institucional");
        agenda.setDescripcion("Evento de prueba");
        agenda.setFecha(LocalDate.of(2026, 10, 10));
        agenda.setHoraInicio(LocalTime.of(8, 0));
        agenda.setHoraFin(LocalTime.of(10, 0));
        agenda.setTipo(TipoEvento.CURSO);
    }

    // =========================================================
    // CASO DE ÉXITO
    // =========================================================

    @Test
    void guardarAgendaSinEspacioDebeGuardarCorrectamente() {

        when(repository.save(any(Agenda.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Agenda resultado = agendaService.save(agenda);

        assertNotNull(resultado);
        assertEquals(
                "Evento institucional",
                resultado.getTitulo()
        );

        assertEquals(
                LocalTime.of(8, 0),
                resultado.getHoraInicio()
        );

        assertEquals(
                LocalTime.of(10, 0),
                resultado.getHoraFin()
        );

        verify(repository, times(1))
                .save(agenda);

        verify(repository, never())
                .existeConflicto(
                        anyLong(),
                        any(LocalDate.class),
                        any(LocalTime.class),
                        any(LocalTime.class)
                );
    }

    // =========================================================
    // CASO DE FALLO DE NEGOCIO
    // =========================================================

    @Test
    void guardarAgendaConHorarioInvalidoDebeLanzarExcepcion() {

        agenda.setHoraInicio(LocalTime.of(10, 0));
        agenda.setHoraFin(LocalTime.of(8, 0));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> agendaService.save(agenda)
                );

        assertEquals(
                "La hora de inicio debe ser anterior a la hora de finalización",
                exception.getMessage()
        );

        verify(repository, never())
                .save(any(Agenda.class));
    }

    // =========================================================
    // DATOS OBLIGATORIOS
    // =========================================================

    @Test
    void guardarAgendaSinFechaDebeLanzarExcepcion() {

        agenda.setFecha(null);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> agendaService.save(agenda));

        assertEquals(
                "La fecha de la agenda es obligatoria",
                exception.getMessage());

        verify(repository, never())
                .save(any(Agenda.class));
    }
    @Test
void guardarAgendaConEspacioOcupadoDebeLanzarExcepcion() {

    // Simulamos un espacio existente en la base de datos
    ReflectionTestUtils.setField(espacio, "id", 1L);

    espacio.setNombre("Aula Magna");
    espacio.setTipo("Aula");
    espacio.setCapacidad(50);
    espacio.setDisponible(true);

    agenda.setEspacio(espacio);

    // EspacioService encuentra el espacio real
    when(espacioService.findById(1L))
            .thenReturn(espacio);

    // Simulamos que ya existe otro evento
    // que ocupa ese espacio en ese horario
    when(repository.existeConflicto(
            eq(1L),
            eq(LocalDate.of(2026, 10, 10)),
            eq(LocalTime.of(8, 0)),
            eq(LocalTime.of(10, 0))
    )).thenReturn(true);

    IllegalArgumentException exception =
            assertThrows(
                    IllegalArgumentException.class,
                    () -> agendaService.save(agenda)
            );

  assertEquals(
        "El espacio ya se encuentra ocupado en la fecha y horario seleccionados",
        exception.getMessage()
);

    verify(espacioService, times(1))
            .findById(1L);

    verify(repository, times(1))
            .existeConflicto(
                    1L,
                    LocalDate.of(2026, 10, 10),
                    LocalTime.of(8, 0),
                    LocalTime.of(10, 0)
            );

    verify(repository, never())
            .save(any(Agenda.class));
}
}