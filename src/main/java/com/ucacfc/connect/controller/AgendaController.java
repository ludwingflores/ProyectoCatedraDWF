package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.TipoEvento;
import com.ucacfc.connect.service.AgendaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agenda")
@Tag(
        name = "Agenda",
        description = "Endpoints para registro, consulta, actualización y eliminación de agendas."
)
public class AgendaController {

    private final AgendaService service;

    public AgendaController(AgendaService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR AGENDAS
    // =========================================================

    @Operation(
            summary = "Listar agendas",
            description = "Obtiene la lista completa de todas las agendas registradas en el sistema."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de agendas obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(
                                    schema = @Schema(
                                            implementation = Agenda.class
                                    )
                            )
                    )
            )
    })
    @GetMapping
    public List<Agenda> findAll() {
        return service.findAll();
    }

    // =========================================================
    // FILTROS + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @Operation(
            summary = "Buscar agendas",
            description = """
                    Permite consultar la agenda institucional aplicando
                    filtros por título, fecha, tipo de evento o espacio,
                    además de paginación y ordenamiento.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Consulta realizada exitosamente"
            )
    })
    @GetMapping("/buscar")
    public ResponseEntity<Page<Agenda>> search(
            @RequestParam(required = false)
            String titulo,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fecha,

            @RequestParam(required = false)
            TipoEvento tipo,

            @RequestParam(required = false)
            Long espacioId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "fecha")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction) {

        Page<Agenda> resultado =
                service.search(
                        titulo,
                        fecha,
                        tipo,
                        espacioId,
                        page,
                        size,
                        sortBy,
                        direction
                );

        return ResponseEntity.ok(resultado);
    }

    // =========================================================
    // OBTENER AGENDA POR ID
    // =========================================================

    @Operation(
            summary = "Obtener agenda por ID",
            description = "Retorna el detalle de una agenda específica según su identificador único."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agenda encontrada",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = Agenda.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Agenda no encontrada con el ID proporcionado",
                    content = @Content(
                            mediaType = "application/json"
                    )
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<Agenda> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    // =========================================================
    // CREAR AGENDA
    // =========================================================

    @Operation(
            summary = "Registrar nueva agenda",
            description = "Crea un nuevo registro de agenda validando campos obligatorios y conflictos de horario."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Agenda creada exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = Agenda.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos inválidos o conflicto de horario",
                    content = @Content(
                            mediaType = "application/json"
                    )
            )
    })
    @PostMapping
    public ResponseEntity<Agenda> create(
            @Valid @RequestBody Agenda entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        service.save(entity)
                );
    }

    // =========================================================
    // ACTUALIZAR AGENDA
    // =========================================================

    @Operation(
            summary = "Actualizar agenda",
            description = "Actualiza una agenda existente validando posibles conflictos de horario."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agenda actualizada correctamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = Agenda.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos inválidos o conflicto de horario",
                    content = @Content(
                            mediaType = "application/json"
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Agenda no encontrada",
                    content = @Content(
                            mediaType = "application/json"
                    )
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Agenda> update(
            @PathVariable Long id,
            @Valid @RequestBody Agenda entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    // =========================================================
    // ELIMINAR AGENDA
    // =========================================================

    @Operation(
            summary = "Eliminar agenda",
            description = "Elimina un registro de agenda mediante su ID."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Agenda eliminada exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Agenda no encontrada"
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}