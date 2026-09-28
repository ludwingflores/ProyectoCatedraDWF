package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.EstadoInscripcion;
import com.ucacfc.connect.model.Inscripcion;
import com.ucacfc.connect.service.InscripcionService;

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
@RequestMapping("/api/inscripciones")
@Tag(
        name = "Inscripciones",
        description = "Endpoints para registro, consulta, búsqueda, actualización y eliminación de inscripciones."
)
public class InscripcionController {

    private final InscripcionService service;

    public InscripcionController(InscripcionService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR INSCRIPCIONES
    // =========================================================

    @Operation(
            summary = "Listar inscripciones",
            description = "Obtiene la lista completa de todas las inscripciones registradas en el sistema."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Lista de inscripciones obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        array = @ArraySchema(
                                schema = @Schema(
                                        implementation = Inscripcion.class
                                )
                        )
                )
        )
    })
    @GetMapping
    public List<Inscripcion> findAll() {
        return service.findAll();
    }

    // =========================================================
    // BÚSQUEDA + FILTROS + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @Operation(
            summary = "Buscar inscripciones",
            description = """
                    Permite consultar inscripciones aplicando filtros
                    por cliente, curso, estado o fecha.

                    También permite paginación y ordenamiento.

                    page: número de página comenzando desde 0.
                    size: cantidad de registros por página.
                    sortBy: campo utilizado para ordenar.
                    direction: asc o desc.
                    """
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Búsqueda realizada exitosamente"
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Parámetros de búsqueda, paginación u ordenamiento inválidos"
        )
    })
    @GetMapping("/buscar")
    public ResponseEntity<Page<Inscripcion>> search(
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) Long cursoId,
            @RequestParam(required = false) EstadoInscripcion estado,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fecha,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fecha") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Page<Inscripcion> resultado = service.search(
                clienteId,
                cursoId,
                estado,
                fecha,
                page,
                size,
                sortBy,
                direction
        );

        return ResponseEntity.ok(resultado);
    }

    // =========================================================
    // OBTENER INSCRIPCIÓN POR ID
    // =========================================================

    @Operation(
            summary = "Obtener inscripción por ID",
            description = "Retorna el detalle de una inscripción específica según su identificador único."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Inscripción encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                implementation = Inscripcion.class
                        )
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Inscripción no encontrada con el ID proporcionado"
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    // =========================================================
    // CREAR INSCRIPCIÓN
    // =========================================================

    @Operation(
            summary = "Registrar nueva inscripción",
            description = "Crea una nueva inscripción validando sus campos obligatorios, el cliente, el curso, duplicados y disponibilidad de cupo."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "201",
                description = "Inscripción creada exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                implementation = Inscripcion.class
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Datos de entrada inválidos o reglas de negocio infringidas"
        )
    })
    @PostMapping
    public ResponseEntity<Inscripcion> create(
            @Valid @RequestBody Inscripcion entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(entity));
    }

    // =========================================================
    // ACTUALIZAR INSCRIPCIÓN
    // =========================================================

    @Operation(
            summary = "Actualizar inscripción",
            description = "Actualiza los datos de una inscripción existente identificada por su ID."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Inscripción actualizada correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                implementation = Inscripcion.class
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Datos enviados en el cuerpo no válidos"
        ),
        @ApiResponse(
                responseCode = "404",
                description = "No existe una inscripción con el ID especificado"
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Inscripcion> update(
            @PathVariable Long id,
            @Valid @RequestBody Inscripcion entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    // =========================================================
    // ELIMINAR INSCRIPCIÓN
    // =========================================================

    @Operation(
            summary = "Eliminar inscripción",
            description = "Elimina el registro de una inscripción del sistema mediante su ID."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "204",
                description = "Inscripción eliminada exitosamente"
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Inscripción no encontrada para eliminar"
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}