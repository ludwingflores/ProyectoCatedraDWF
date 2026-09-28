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

import org.springframework.data.domain.Page;
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

    public ServicioCateringController(
            ServicioCateringService service) {

        this.service = service;
    }

    @Operation(
            summary = "Listar servicios de catering",
            description = """
                    Los administradores pueden consultar todos los
                    servicios. Los demás usuarios únicamente pueden
                    consultar servicios activos.
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
                                            implementation = ServicioCatering.class
                                    )
                            )
                    )
            )
    })
    @GetMapping
    public List<ServicioCatering> findAll(
            Authentication authentication) {

        if (esAdmin(authentication)) {
            return service.findAll();
        }

        return service.findAllActivos();
    }

    @Operation(
            summary = "Buscar servicios de catering",
            description = """
                    Permite consultar servicios mediante filtros,
                    paginación y ordenamiento. Los administradores
                    pueden consultar servicios activos e inactivos.
                    Los demás usuarios únicamente reciben servicios activos.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Consulta realizada exitosamente"
            )
    })
    @GetMapping("/buscar")
    public ResponseEntity<Page<ServicioCatering>> search(
            @RequestParam(required = false)
            String nombre,

            @RequestParam(required = false)
            String tipo,

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

        Page<ServicioCatering> resultado;

        if (esAdmin(authentication)) {

            resultado = service.search(
                    nombre,
                    tipo,
                    activo,
                    page,
                    size,
                    sortBy,
                    direction
            );

        } else {

            /*
             * El parámetro "activo" se ignora para usuarios
             * no administradores. Siempre se limita la consulta
             * a servicios activos.
             */
            resultado = service.searchActivos(
                    nombre,
                    tipo,
                    page,
                    size,
                    sortBy,
                    direction
            );
        }

        return ResponseEntity.ok(resultado);
    }

    @Operation(
            summary = "Obtener servicio de catering por ID",
            description = """
                    Los administradores pueden consultar cualquier servicio.
                    Los demás usuarios únicamente pueden consultar
                    servicios activos.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Servicio encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ServicioCatering.class
                            )
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
            return ResponseEntity.ok(
                    service.findById(id)
            );
        }

        return ResponseEntity.ok(
                service.findActivoById(id)
        );
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
                            schema = @Schema(
                                    implementation = ServicioCatering.class
                            )
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

        return ResponseEntity
                .status(HttpStatus.CREATED)
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
                            schema = @Schema(
                                    implementation = ServicioCatering.class
                            )
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

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    @Operation(
            summary = "Eliminar servicio de catering",
            description = """
                    Inactiva lógicamente un servicio de catering
                    para conservar su historial.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Servicio inactivado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Servicio no encontrado"
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