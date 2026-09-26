package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Catering;
import com.ucacfc.connect.service.CateringService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/catering")
@Tag(
    name = "Catering",
    description = "Endpoints para registro, consulta, actualización y eliminación de catering."
)
public class CateringController {

    private final CateringService service;

    public CateringController(CateringService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR CATERING
    // =========================================================

    @Operation(
        summary = "Listar catering",
        description = "Los clientes consultan únicamente sus propias solicitudes. Los usuarios administrativos autorizados consultan todos los registros."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Lista de catering obtenida exitosamente",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(
                    schema = @Schema(implementation = Catering.class)
                )
            )
        )
    })
    @GetMapping
    public List<Catering> findAll(Authentication authentication) {

        if (esCliente(authentication)) {
            return service.findAllByClienteCorreo(
                    authentication.getName()
            );
        }

        return service.findAll();
    }

    // =========================================================
    // OBTENER CATERING POR ID
    // =========================================================

    @Operation(
        summary = "Obtener catering por ID",
        description = "Los clientes solamente pueden consultar solicitudes de catering que les pertenezcan."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Catering encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Catering.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Catering no encontrado",
            content = @Content(mediaType = "application/json")
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<Catering> findById(
            @PathVariable Long id,
            Authentication authentication) {

        if (esCliente(authentication)) {

            return ResponseEntity.ok(
                    service.findByIdAndClienteCorreo(
                            id,
                            authentication.getName()
                    )
            );
        }

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    // =========================================================
    // CREAR CATERING
    // =========================================================

    @Operation(
        summary = "Registrar nuevo catering",
        description = "Crea una solicitud de catering. El costo total es calculado automáticamente por el servidor."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Catering creado exitosamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Catering.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos",
            content = @Content(mediaType = "application/json")
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Cliente no encontrado",
            content = @Content(mediaType = "application/json")
        )
    })
    @PostMapping
    public ResponseEntity<Catering> create(
            @Valid @RequestBody Catering entity,
            Authentication authentication) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        service.save(
                                entity,
                                authentication
                        )
                );
    }

    // =========================================================
    // ACTUALIZAR CATERING
    // =========================================================

    @Operation(
        summary = "Actualizar catering",
        description = "Actualiza un catering existente y recalcula automáticamente su costo."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Catering actualizado correctamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Catering.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos",
            content = @Content(mediaType = "application/json")
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Catering no encontrado",
            content = @Content(mediaType = "application/json")
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Catering> update(
            @PathVariable Long id,
            @Valid @RequestBody Catering entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    // =========================================================
    // ELIMINAR CATERING
    // =========================================================

    @Operation(
        summary = "Eliminar catering",
        description = "Elimina un registro de catering mediante su ID."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Catering eliminado exitosamente"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Catering no encontrado"
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // UTILIDADES DE SEGURIDAD
    // =========================================================

    private boolean esCliente(
            Authentication authentication) {

        return authentication != null
                && authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_CLIENTE")
                        );
    }
}