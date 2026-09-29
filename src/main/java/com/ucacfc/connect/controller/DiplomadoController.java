package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Diplomado;
import com.ucacfc.connect.service.DiplomadoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diplomados")
@Tag(
        name = "Diplomados",
        description = "Endpoints para registro, consulta, búsqueda, actualización y eliminación de diplomados."
)
public class DiplomadoController {

    private final DiplomadoService service;

    public DiplomadoController(DiplomadoService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR TODOS LOS DIPLOMADOS
    // =========================================================

    @Operation(
            summary = "Listar diplomados",
            description = "Obtiene la lista completa de todos los diplomados registrados en el sistema."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Lista de diplomados obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        array = @ArraySchema(
                                schema = @Schema(implementation = Diplomado.class)
                        )
                )
        )
    })

    @GetMapping
    public List<Diplomado> findAll(Authentication authentication) {

            if (esAdmin(authentication)) {
                    return service.findAll();
            }

            return service.findAllActivos();
    }

    // =========================================================
    // FILTRO + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @Operation(
            summary = "Buscar diplomados",
            description = """
                    Busca diplomados por nombre e incluye paginación y ordenamiento.

                    nombre: texto contenido en el nombre del diplomado.
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
                description = "Parámetros de búsqueda, paginación u ordenamiento inválidos",
                content = @Content(mediaType = "application/json")
        )
    })

    @GetMapping("/buscar")
public Page<Diplomado> search(
        @RequestParam(defaultValue = "") String nombre,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "nombre") String sortBy,
        @RequestParam(defaultValue = "asc") String direction,
                Authentication authentication) {

        if (esAdmin(authentication)) {
                return service.searchByNombre(
                                nombre,
                                page,
                                size,
                                sortBy,
                                direction);
        }

        return service.searchActivosByNombre(
                        nombre,
                        page,
                        size,
                        sortBy,
                        direction);
}


    // =========================================================
    // OBTENER DIPLOMADO POR ID
    // =========================================================

    @Operation(
            summary = "Obtener diplomado por ID",
            description = "Retorna el detalle de un diplomado específico según su identificador único."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Diplomado encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = Diplomado.class)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Diplomado no encontrado con el ID proporcionado",
                content = @Content(mediaType = "application/json")
        )
    })

    @GetMapping("/{id}")
public ResponseEntity<Diplomado> findById(
        @PathVariable Long id,
                Authentication authentication) {

        if (esAdmin(authentication)) {
                return ResponseEntity.ok(
                                service.findById(id));
        }

        return ResponseEntity.ok(
                        service.findActivoById(id));
}

    // =========================================================
    // CREAR DIPLOMADO
    // =========================================================

    @Operation(
            summary = "Registrar nuevo diplomado",
            description = "Crea un nuevo registro de diplomado validando sus campos obligatorios."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "201",
                description = "Diplomado creado exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = Diplomado.class)
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json")
        )
    })
    @PostMapping
    public ResponseEntity<Diplomado> create(
            @Valid @RequestBody Diplomado entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(entity));
    }

    // =========================================================
    // ACTUALIZAR DIPLOMADO
    // =========================================================

    @Operation(
            summary = "Actualizar diplomado",
            description = "Actualiza los datos de un diplomado existente identificado por su ID."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Diplomado actualizado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = Diplomado.class)
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Datos enviados en el cuerpo no válidos",
                content = @Content(mediaType = "application/json")
        ),
        @ApiResponse(
                responseCode = "404",
                description = "No existe un registro con el ID especificado",
                content = @Content(mediaType = "application/json")
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Diplomado> update(
            @PathVariable Long id,
            @Valid @RequestBody Diplomado entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    // =========================================================
    // ELIMINAR DIPLOMADO
    // =========================================================

    @Operation(
            summary = "Eliminar diplomado",
            description = "Elimina el registro de un diplomado del sistema mediante su ID."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "204",
                description = "Diplomado eliminado exitosamente"
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Diplomado no encontrado para eliminar",
                content = @Content(mediaType = "application/json")
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
                    @PathVariable Long id) {

            service.delete(id);
            return ResponseEntity.noContent().build();
    }

    private boolean esAdmin(Authentication authentication) {

            if (authentication == null) {
                    return false;
            }

            return authentication.getAuthorities()
                            .stream()
                            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }

}
