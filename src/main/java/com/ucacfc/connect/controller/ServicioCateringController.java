package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.ServicioCatering;
import com.ucacfc.connect.service.ServicioCateringService;

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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/servicios-catering")
@Tag(
    name = "Servicios de Catering",
    description = "Administración del catálogo de servicios de catering."
)
public class ServicioCateringController {

    private final ServicioCateringService service;

    public ServicioCateringController(ServicioCateringService service) {
        this.service = service;
    }

    @Operation(
        summary = "Listar servicios de catering activos",
        description = "Obtiene los servicios de catering disponibles para realizar solicitudes."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Lista obtenida exitosamente",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(
                    schema = @Schema(implementation = ServicioCatering.class)
                )
            )
        )
    })

    @GetMapping
public List<ServicioCatering> findAll(Authentication authentication) {

    if (esAdmin(authentication)) {
        return service.findAll();
    }

    return service.findAllActivos();
}

    @Operation(
        summary = "Obtener servicio de catering por ID",
        description = "Obtiene un servicio de catering activo mediante su identificador."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Servicio encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ServicioCatering.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Servicio no encontrado"
        )
    })
 @GetMapping("/{id}")
public ResponseEntity<ServicioCatering> findById(
        @PathVariable Long id,
        Authentication authentication) {

    if (esAdmin(authentication)) {
        return ResponseEntity.ok(service.findById(id));
    }

    return ResponseEntity.ok(service.findActivoById(id));
}

    @Operation(
        summary = "Crear servicio de catering",
        description = "Registra un nuevo servicio en el catálogo de catering."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Servicio creado exitosamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ServicioCatering.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos de entrada inválidos"
        )
    })
    @PostMapping
    public ResponseEntity<ServicioCatering> create(
            @Valid @RequestBody ServicioCatering entity) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.save(entity));
    }

    @Operation(
        summary = "Actualizar servicio de catering",
        description = "Actualiza los datos de un servicio existente."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Servicio actualizado correctamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ServicioCatering.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Servicio no encontrado"
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<ServicioCatering> update(
            @PathVariable Long id,
            @Valid @RequestBody ServicioCatering entity) {

        return ResponseEntity.ok(service.update(id, entity));
    }

    @Operation(
        summary = "Eliminar servicio de catering",
        description = "Elimina un servicio del catálogo de catering."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Servicio eliminado exitosamente"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Servicio no encontrado"
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    private boolean esAdmin(Authentication authentication) {

    if (authentication == null) {
        return false;
    }

    return authentication.getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch("ROLE_ADMIN"::equals);
}
}
