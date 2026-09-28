package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Rol;
import com.ucacfc.connect.service.RolService;

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
@RequestMapping("/api/roles")
@Tag(
        name = "Roles",
        description = "Endpoints para registro, consulta, actualización y eliminación de roles."
)
public class RolController {

    private final RolService service;

    public RolController(RolService service) {
        this.service = service;
    }

    @Operation(
            summary = "Listar roles",
            description = "Obtiene la lista completa de todos los roles disponibles."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de roles obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(
                                    schema = @Schema(
                                            implementation = Rol.class
                                    )
                            )
                    )
            )
    })
    @GetMapping
    public List<Rol> findAll() {
        return service.findAll();
    }

    @Operation(
            summary = "Buscar roles",
            description = """
                    Permite consultar roles aplicando filtro por nombre,
                    además de paginación y ordenamiento.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Consulta de roles realizada exitosamente"
            )
    })
    @GetMapping("/buscar")
    public ResponseEntity<Page<Rol>> search(
            @RequestParam(required = false)
            String nombre,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "nombre")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction) {

        Page<Rol> resultado =
                service.search(
                        nombre,
                        page,
                        size,
                        sortBy,
                        direction
                );

        return ResponseEntity.ok(resultado);
    }

    @Operation(
            summary = "Obtener rol por ID",
            description = "Obtiene un rol mediante su identificador."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Rol encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = Rol.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Rol no encontrado"
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<Rol> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    @Operation(
            summary = "Registrar nuevo rol",
            description = "Crea un nuevo rol en el sistema."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Rol creado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de entrada inválidos"
            )
    })
    @PostMapping
    public ResponseEntity<Rol> create(
            @Valid @RequestBody Rol entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(entity));
    }

    @Operation(
            summary = "Actualizar rol",
            description = "Actualiza los datos de un rol existente."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Rol actualizado correctamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Rol no encontrado"
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Rol> update(
            @PathVariable Long id,
            @Valid @RequestBody Rol entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    @Operation(
            summary = "Eliminar rol",
            description = "Elimina un rol mediante su identificador."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Rol eliminado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Rol no encontrado"
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