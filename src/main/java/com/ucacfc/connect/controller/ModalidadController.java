package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Modalidad;
import com.ucacfc.connect.service.ModalidadService;

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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/modalidades")
@Tag(
        name = "Modalidades",
        description = "Administración del catálogo de modalidades académicas."
)
public class ModalidadController {

    private final ModalidadService service;

    public ModalidadController(ModalidadService service) {
        this.service = service;
    }

    @Operation(
            summary = "Listar modalidades",
            description = """
                    Los administradores pueden consultar todas las modalidades.
                    Los demás usuarios únicamente pueden consultar modalidades activas.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(
                                    schema = @Schema(
                                            implementation = Modalidad.class
                                    )
                            )
                    )
            )
    })
    @GetMapping
    public List<Modalidad> findAll(
            Authentication authentication) {

        if (esAdmin(authentication)) {
            return service.findAll();
        }

        return service.findAllActivas();
    }

    @Operation(
            summary = "Buscar modalidades",
            description = """
                    Permite consultar modalidades mediante filtros,
                    paginación y ordenamiento. Los administradores
                    pueden consultar modalidades activas e inactivas.
                    Los demás usuarios únicamente reciben modalidades activas.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Consulta realizada exitosamente"
            )
    })
    @GetMapping("/buscar")
    public ResponseEntity<Page<Modalidad>> search(
            @RequestParam(required = false)
            String nombre,

            @RequestParam(required = false)
            Boolean activo,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "nombre")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction,

            Authentication authentication) {

        Page<Modalidad> resultado;

        if (esAdmin(authentication)) {

            resultado = service.search(
                    nombre,
                    activo,
                    page,
                    size,
                    sortBy,
                    direction
            );

        } else {

            resultado = service.searchActivas(
                    nombre,
                    page,
                    size,
                    sortBy,
                    direction
            );
        }

        return ResponseEntity.ok(resultado);
    }

    @Operation(
            summary = "Obtener modalidad por ID",
            description = """
                    Los administradores pueden consultar cualquier modalidad.
                    Los demás usuarios únicamente pueden consultar modalidades activas.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Modalidad encontrada",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = Modalidad.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Modalidad no encontrada"
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<Modalidad> findById(
            @PathVariable Long id,
            Authentication authentication) {

        if (esAdmin(authentication)) {
            return ResponseEntity.ok(
                    service.findById(id)
            );
        }

        return ResponseEntity.ok(
                service.findActivaById(id)
        );
    }

    @Operation(
            summary = "Crear modalidad",
            description = "Registra una nueva modalidad académica."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Modalidad creada exitosamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de entrada inválidos"
            )
    })
    @PostMapping
    public ResponseEntity<Modalidad> create(
            @Valid @RequestBody Modalidad entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(entity));
    }

    @Operation(
            summary = "Actualizar modalidad",
            description = "Actualiza los datos de una modalidad existente."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Modalidad actualizada correctamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Modalidad no encontrada"
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Modalidad> update(
            @PathVariable Long id,
            @Valid @RequestBody Modalidad entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    @Operation(
            summary = "Eliminar modalidad",
            description = """
                    Inactiva lógicamente una modalidad académica
                    para conservar su historial.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Modalidad inactivada exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Modalidad no encontrada"
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

    private boolean esAdmin(
            Authentication authentication) {

        if (authentication == null) {
            return false;
        }

        return authentication
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }
}