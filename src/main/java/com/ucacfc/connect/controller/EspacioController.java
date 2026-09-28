package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Espacio;
import com.ucacfc.connect.service.EspacioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/espacios")
@Tag(
        name = "Espacios",
        description = "Endpoints para registro, consulta, actualización y eliminación de espacios."
)
public class EspacioController {

    private final EspacioService service;

    public EspacioController(EspacioService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR ESPACIOS
    // =========================================================

    @Operation(
            summary = "Listar espacios",
            description = "Obtiene la lista completa de todos los espacios registrados en el sistema."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de espacios obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(
                                    schema = @Schema(
                                            implementation = Espacio.class
                                    )
                            )
                    )
            )
    })
    @GetMapping
    public List<Espacio> findAll() {
        return service.findAll();
    }

    // =========================================================
    // FILTROS + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @Operation(
            summary = "Buscar espacios",
            description = """
                    Permite consultar espacios aplicando filtros por
                    nombre, tipo, capacidad mínima o disponibilidad,
                    además de paginación y ordenamiento.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Consulta de espacios realizada exitosamente"
            )
    })
    @GetMapping("/buscar")
    public ResponseEntity<Page<Espacio>> search(
            @RequestParam(required = false)
            String nombre,

            @RequestParam(required = false)
            String tipo,

            @RequestParam(required = false)
            Integer capacidad,

            @RequestParam(required = false)
            Boolean disponible,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "nombre")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction) {

        Page<Espacio> resultado =
                service.search(
                        nombre,
                        tipo,
                        capacidad,
                        disponible,
                        page,
                        size,
                        sortBy,
                        direction
                );

        return ResponseEntity.ok(resultado);
    }

    // =========================================================
    // OBTENER ESPACIO POR ID
    // =========================================================

    @Operation(
            summary = "Obtener espacio por ID",
            description = "Retorna el detalle de un espacio específico según su identificador único."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Espacio encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = Espacio.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Espacio no encontrado con el ID proporcionado",
                    content = @Content(
                            mediaType = "application/json"
                    )
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<Espacio> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    // =========================================================
    // CREAR ESPACIO
    // =========================================================

    @Operation(
            summary = "Registrar nuevo espacio",
            description = "Crea un nuevo registro de espacio validando sus campos obligatorios."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Espacio creado exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = Espacio.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de entrada inválidos",
                    content = @Content(
                            mediaType = "application/json"
                    )
            )
    })
    @PostMapping
    public ResponseEntity<Espacio> create(
            @Valid @RequestBody Espacio entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        service.save(entity)
                );
    }

    // =========================================================
    // ACTUALIZAR ESPACIO
    // =========================================================

    @Operation(
            summary = "Actualizar espacio",
            description = "Actualiza los datos de un espacio existente identificado por su ID."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Espacio actualizado correctamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = Espacio.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos enviados no válidos",
                    content = @Content(
                            mediaType = "application/json"
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Espacio no encontrado",
                    content = @Content(
                            mediaType = "application/json"
                    )
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Espacio> update(
            @PathVariable Long id,
            @Valid @RequestBody Espacio entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    // =========================================================
    // ELIMINAR ESPACIO
    // =========================================================

    @Operation(
            summary = "Eliminar espacio",
            description = "Elimina el registro de un espacio mediante su ID."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Espacio eliminado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Espacio no encontrado"
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