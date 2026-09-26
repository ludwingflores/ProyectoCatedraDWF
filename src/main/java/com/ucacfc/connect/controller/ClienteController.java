package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@Tag(
        name = "Clientes",
        description = "Endpoints para registro, consulta, actualización y eliminación de clientes."
)
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR CLIENTES
    // =========================================================

    @Operation(
            summary = "Listar clientes",
            description = "ADMIN, RECEPCIONISTA y CONTABILIDAD pueden consultar todos los clientes. CLIENTE consulta únicamente su propio registro."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Clientes obtenidos exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(
                                    schema = @Schema(implementation = Cliente.class)
                            )
                    )
            )
    })
    @GetMapping
    public ResponseEntity<?> findAll(Authentication authentication) {

        String rol = obtenerRol(authentication);

        if ("CLIENTE".equals(rol)) {

            Cliente cliente =
                    service.findByCorreo(authentication.getName());

            return ResponseEntity.ok(List.of(cliente));
        }

        return ResponseEntity.ok(service.findAll());
    }


    // =========================================================
    // OBTENER CLIENTE POR ID
    // =========================================================

    @Operation(
            summary = "Obtener cliente por ID",
            description = "Los usuarios administrativos pueden consultar cualquier cliente. CLIENTE solamente puede consultar su propio registro."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Cliente encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Cliente.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "El cliente no tiene permiso para consultar este registro"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Cliente no encontrado"
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> findById(
            @Parameter(
                    description = "Identificador único del cliente",
                    example = "1",
                    required = true
            )
            @PathVariable Long id,
            Authentication authentication) {

        String rol = obtenerRol(authentication);

        Cliente cliente = service.findById(id);

        if ("CLIENTE".equals(rol)
                && !cliente.getCorreo().equalsIgnoreCase(authentication.getName())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(cliente);
    }


    // =========================================================
    // CREAR CLIENTE
    // =========================================================

    @Operation(
            summary = "Registrar nuevo cliente",
            description = "Crea un nuevo registro de cliente."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Cliente creado exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Cliente.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de entrada inválidos"
            )
    })
    @PostMapping
    public ResponseEntity<Cliente> create(
            @Valid @RequestBody Cliente entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(entity));
    }


    // =========================================================
    // ACTUALIZAR CLIENTE
    // =========================================================

    @Operation(
            summary = "Actualizar cliente",
            description = "Actualiza los datos de un cliente existente."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Cliente actualizado correctamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Cliente.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos inválidos"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Cliente no encontrado"
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> update(
            @Parameter(
                    description = "ID del cliente a modificar",
                    example = "1",
                    required = true
            )
            @PathVariable Long id,
            @Valid @RequestBody Cliente entity) {

        return ResponseEntity.ok(service.update(id, entity));
    }


    // =========================================================
    // ELIMINAR CLIENTE
    // =========================================================

    @Operation(
            summary = "Eliminar cliente",
            description = "Elimina un cliente mediante su ID."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Cliente eliminado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Cliente no encontrado"
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(
                    description = "ID del cliente a eliminar",
                    example = "1",
                    required = true
            )
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }


    // =========================================================
    // OBTENER ROL
    // =========================================================

    private String obtenerRol(Authentication authentication) {

        return authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(authority ->
                        authority.getAuthority()
                                .replace("ROLE_", "")
                )
                .orElse("");
    }
}