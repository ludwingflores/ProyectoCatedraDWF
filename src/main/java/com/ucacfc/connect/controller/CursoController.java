package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Curso;
import com.ucacfc.connect.service.CursoService;

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
@RequestMapping("/api/cursos")
@Tag(
        name = "Cursos",
        description = "Endpoints para registro, consulta, búsqueda, actualización y eliminación de cursos."
)
public class CursoController {

    private final CursoService service;

    public CursoController(CursoService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR TODOS LOS CURSOS
    // =========================================================

    @Operation(
            summary = "Listar cursos",
            description = "Obtiene la lista completa de todos los cursos registrados en el sistema."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Lista de cursos obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        array = @ArraySchema(
                                schema = @Schema(implementation = Curso.class)
                        )
                )
        )
    })

    @GetMapping
    public List<Curso> findAll(Authentication authentication) {

            if (esAdmin(authentication)) {
                    return service.findAll();
            }

            return service.findAllActivos();
    }


    // =========================================================
    // BUSCAR CURSOS CON FILTRO, PAGINACIÓN Y ORDENAMIENTO
    // =========================================================

    @Operation(
            summary = "Buscar cursos",
            description = """
                    Busca cursos por nombre e incluye paginación y ordenamiento.

                    Parámetros:
                    - nombre: texto a buscar en el nombre del curso.
                    - page: número de página, comenzando desde 0.
                    - size: cantidad de registros por página.
                    - sortBy: campo utilizado para ordenar.
                    - direction: dirección del ordenamiento (asc o desc).
                    """
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Búsqueda de cursos realizada exitosamente"
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Parámetros de búsqueda, paginación u ordenamiento inválidos",
                content = @Content(mediaType = "application/json")
        )
    })

    @GetMapping("/buscar")
public Page<Curso> search(
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
                direction
        );
    }

    return service.searchActivosByNombre(
            nombre,
            page,
            size,
            sortBy,
            direction
    );
}

    // =========================================================
    // OBTENER CURSO POR ID
    // =========================================================

    @Operation(
            summary = "Obtener curso por ID",
            description = "Retorna el detalle de un curso específico según su identificador único."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Curso encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = Curso.class)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Curso no encontrado con el ID proporcionado",
                content = @Content(mediaType = "application/json")
        )
    })

    @GetMapping("/{id}")
      public ResponseEntity<Curso> findById(
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
    // CREAR CURSO
    // =========================================================

    @Operation(
            summary = "Crear un nuevo curso",
            description = "Crea un nuevo curso validando sus campos obligatorios."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "201",
                description = "Curso creado exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = Curso.class)
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json")
        )
    })
    @PostMapping
    public ResponseEntity<Curso> create(
            @Valid @RequestBody Curso entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(entity));
    }

    // =========================================================
    // ACTUALIZAR CURSO
    // =========================================================

    @Operation(
            summary = "Actualizar curso",
            description = "Actualiza los datos de un curso existente identificado por su ID."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Curso actualizado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = Curso.class)
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
    public ResponseEntity<Curso> update(
            @PathVariable Long id,
            @Valid @RequestBody Curso entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    // =========================================================
    // ELIMINAR CURSO
    // =========================================================

    @Operation(
            summary = "Eliminar curso",
            description = "Elimina el registro de un curso del sistema mediante su ID."
    )
    @ApiResponses({
        @ApiResponse(
                responseCode = "204",
                description = "Curso eliminado exitosamente"
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Curso no encontrado para eliminar",
                content = @Content(mediaType = "application/json")
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
    private boolean esAdmin(Authentication authentication) {

    if (authentication == null) {
        return false;
    }

    return authentication.getAuthorities()
            .stream()
            .anyMatch(authority ->
                    authority.getAuthority().equals("ROLE_ADMIN")
            );
}
}
