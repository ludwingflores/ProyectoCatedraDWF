package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Cotizacion;
import com.ucacfc.connect.service.CotizacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import java.net.URI;
import java.util.List;

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

    public CotizacionController(CotizacionService service) {
        this.service = service;
    }

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

        return ResponseEntity.ok(service.findAll());
    }

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

        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @Operation(
        summary = "Crear cotización",
        description = "Crea una cotización con uno o varios servicios"
    )
    public ResponseEntity<Cotizacion> create(
            @Valid @RequestBody Cotizacion cotizacion) {

        Cotizacion created = service.save(cotizacion);

        return ResponseEntity
                .created(
                        URI.create(
                                "/api/cotizaciones/" + created.getId()
                        )
                )
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Actualizar cotización",
        description = "Actualiza una cotización y sus servicios"
    )
    public ResponseEntity<Cotizacion> update(
            @PathVariable Long id,
            @Valid @RequestBody Cotizacion cotizacion) {

        return ResponseEntity.ok(
                service.update(id, cotizacion)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Eliminar cotización",
        description = "Elimina una cotización y sus detalles asociados"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    private boolean esCliente(Authentication authentication) {
        return authentication != null
                && authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_CLIENTE")
                );
    }
}