package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Categoria;
import com.ucacfc.connect.service.CategoriaService;

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
@RequestMapping("/api/categorias")
@Tag(
        name = "Categorías",
        description = "Administración del catálogo de categorías académicas."
)
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @Operation(
            summary = "Listar categorías",
            description = """
                    Los administradores pueden consultar todas las categorías.
                    Los demás usuarios únicamente pueden consultar categorías activas.
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
                                            implementation = Categoria.class
                                    )
                            )
                    )
            )
    })
    @GetMapping
    public List<Categoria> findAll(
            Authentication authentication) {

        if (esAdmin(authentication)) {
            return service.findAll();
        }

        return service.findAllActivas();
    }

    @Operation(
            summary = "Buscar categorías",
            description = """
                    Permite consultar categorías mediante filtros,
                    paginación y ordenamiento. Los administradores
                    pueden consultar categorías activas e inactivas.
                    Los demás usuarios únicamente reciben categorías activas.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Consulta realizada exitosamente"
            )
    })
    @GetMapping("/buscar")
    public ResponseEntity<Page<Categoria>> search(
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

        Page<Categoria> resultado;

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
            summary = "Obtener categoría por ID",
            description = """
                    Los administradores pueden consultar cualquier categoría.
                    Los demás usuarios únicamente pueden consultar categorías activas.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Categoría encontrada",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = Categoria.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Categoría no encontrada"
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> findById(
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
            summary = "Crear categoría",
            description = "Registra una nueva categoría académica."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Categoría creada exitosamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de entrada inválidos"
            )
    })
    @PostMapping
    public ResponseEntity<Categoria> create(
            @Valid @RequestBody Categoria entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(entity));
    }

    @Operation(
            summary = "Actualizar categoría",
            description = "Actualiza los datos de una categoría existente."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Categoría actualizada correctamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Categoría no encontrada"
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> update(
            @PathVariable Long id,
            @Valid @RequestBody Categoria entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    @Operation(
            summary = "Eliminar categoría",
            description = """
                    Inactiva lógicamente una categoría académica
                    para conservar su historial.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Categoría inactivada exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Categoría no encontrada"
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