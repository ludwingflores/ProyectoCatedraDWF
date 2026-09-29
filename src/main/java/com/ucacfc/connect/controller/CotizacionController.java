package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Cotizacion;
import com.ucacfc.connect.model.EstadoCotizacion;
import com.ucacfc.connect.service.CotizacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cotizaciones")
@Tag(
        name = "Cotizaciones",
        description = "Gestión de cotizaciones y servicios asociados"
)
public class CotizacionController {

    private final CotizacionService service;

    public CotizacionController(
            CotizacionService service) {

        this.service = service;
    }

    // =========================================================
    // LISTAR COTIZACIONES
    // =========================================================

    @GetMapping
    @Operation(
            summary = "Listar cotizaciones",
            description = "Obtiene las cotizaciones permitidas para el usuario autenticado"
    )
    public ResponseEntity<List<Cotizacion>> findAll(
            Authentication authentication) {

        if (esCliente(authentication)) {

            return ResponseEntity.ok(
                    service.findAllByClienteCorreo(
                            authentication.getName()
                    )
            );
        }

        return ResponseEntity.ok(
                service.findAll()
        );
    }

    // =========================================================
    // FILTROS + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @GetMapping("/buscar")
    @Operation(
            summary = "Buscar cotizaciones",
            description = """
                    Permite buscar cotizaciones utilizando filtros,
                    paginación y ordenamiento.

                    Los usuarios administrativos pueden filtrar por
                    cliente, estado o fecha.

                    Los usuarios con rol CLIENTE únicamente pueden
                    consultar sus propias cotizaciones.
                    """
    )
    public ResponseEntity<Page<Cotizacion>> search(
            @RequestParam(required = false)
            Long clienteId,

            @RequestParam(required = false)
            EstadoCotizacion estado,

            @RequestParam(required = false)
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate fecha,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "fecha")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction,

            Authentication authentication) {

        if (esCliente(authentication)) {

            Page<Cotizacion> resultado =
                    service.searchByClienteCorreo(
                            authentication.getName(),
                            estado,
                            fecha,
                            page,
                            size,
                            sortBy,
                            direction
                    );

            return ResponseEntity.ok(resultado);
        }

        Page<Cotizacion> resultado =
                service.search(
                        clienteId,
                        estado,
                        fecha,
                        page,
                        size,
                        sortBy,
                        direction
                );

        return ResponseEntity.ok(resultado);
    }

    // =========================================================
    // OBTENER COTIZACIÓN POR ID
    // =========================================================

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtener cotización",
            description = "Obtiene una cotización por su identificador"
    )
    public ResponseEntity<Cotizacion> findById(
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
    // CREAR COTIZACIÓN
    // =========================================================

   @PostMapping
   @Operation(
        summary = "Crear cotización",
        description = "Crea una cotización con uno o varios servicios"
)
public ResponseEntity<Cotizacion> create(
        @Valid
        @RequestBody
        Cotizacion cotizacion,
                Authentication authentication) {

        Cotizacion created;

        if (esCliente(authentication)) {

                created = service.saveByClienteCorreo(
                                cotizacion,
                                authentication.getName());

        } else {

                created = service.save(cotizacion);
        }

        return ResponseEntity
                        .created(
                                        URI.create(
                                                        "/api/cotizaciones/"
                                                                        + created.getId()))
                        .body(created);
}


    // =========================================================
    // ACTUALIZAR COTIZACIÓN
    // =========================================================

    @PutMapping("/{id}")
    @Operation(
            summary = "Actualizar cotización",
            description = "Actualiza una cotización y sus servicios"
    )
    public ResponseEntity<Cotizacion> update(
            @PathVariable Long id,
            @Valid
            @RequestBody
            Cotizacion cotizacion) {

        return ResponseEntity.ok(
                service.update(
                        id,
                        cotizacion
                )
        );
    }

    // =========================================================
    // ELIMINAR COTIZACIÓN
    // =========================================================

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Eliminar cotización",
            description = "Elimina una cotización y sus detalles asociados"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    // =========================================================
    // CONTROL DE ROL CLIENTE
    // =========================================================

    private boolean esCliente(
            Authentication authentication) {

        return authentication != null
                && authentication
                .getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority
                                .getAuthority()
                                .equals("ROLE_CLIENTE")
                );
    }
}