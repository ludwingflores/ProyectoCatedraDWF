package com.ucacfc.connect.service;

import com.ucacfc.connect.dto.HistorialClienteResponse;
import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.repository.AlquilerRepository;
import com.ucacfc.connect.repository.CateringRepository;
import com.ucacfc.connect.repository.ClienteRepository;
import com.ucacfc.connect.repository.CotizacionRepository;
import com.ucacfc.connect.repository.InscripcionRepository;
import com.ucacfc.connect.repository.PagoRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ClienteService {

    private final ClienteRepository repository;
    private final InscripcionRepository inscripcionRepository;
    private final CotizacionRepository cotizacionRepository;
    private final AlquilerRepository alquilerRepository;
    private final CateringRepository cateringRepository;
    private final PagoRepository pagoRepository;

    public ClienteService(
            ClienteRepository repository,
            InscripcionRepository inscripcionRepository,
            CotizacionRepository cotizacionRepository,
            AlquilerRepository alquilerRepository,
            CateringRepository cateringRepository,
            PagoRepository pagoRepository) {

        this.repository = repository;
        this.inscripcionRepository = inscripcionRepository;
        this.cotizacionRepository = cotizacionRepository;
        this.alquilerRepository = alquilerRepository;
        this.cateringRepository = cateringRepository;
        this.pagoRepository = pagoRepository;
    }

    // =========================================================
    // LISTAR CLIENTES
    // =========================================================

    @Transactional(readOnly = true)
    public List<Cliente> findAll() {
        return repository.findAll();
    }

    // =========================================================
    // BÚSQUEDA + FILTROS + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @Transactional(readOnly = true)
    public Page<Cliente> search(
            String nombre,
            String dui,
            String nit,
            String empresa,
            String correo,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(
                page,
                size,
                sort
        );

        if (dui != null && !dui.isBlank()) {
            return repository.findByDuiContainingIgnoreCase(
                    dui.trim(),
                    pageable
            );
        }

        if (nit != null && !nit.isBlank()) {
            return repository.findByNitContainingIgnoreCase(
                    nit.trim(),
                    pageable
            );
        }

        if (empresa != null && !empresa.isBlank()) {
            return repository.findByEmpresaContainingIgnoreCase(
                    empresa.trim(),
                    pageable
            );
        }

        if (correo != null && !correo.isBlank()) {
            return repository.findByCorreoContainingIgnoreCase(
                    correo.trim(),
                    pageable
            );
        }

        return repository.findByNombreContainingIgnoreCase(
                nombre == null ? "" : nombre.trim(),
                pageable
        );
    }

    // =========================================================
    // OBTENER CLIENTE POR ID
    // =========================================================

    @Transactional(readOnly = true)
    public Cliente findById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cliente no encontrado con id: " + id
                        )
                );
    }

    // =========================================================
    // OBTENER CLIENTE POR CORREO
    // =========================================================

    @Transactional(readOnly = true)
    public Cliente findByCorreo(String correo) {

        return repository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cliente no encontrado con correo: " + correo
                        )
                );
    }

    // =========================================================
    // HISTORIAL DEL CLIENTE - RF14
    // =========================================================

    @Transactional(readOnly = true)
    public HistorialClienteResponse obtenerHistorial(Long clienteId) {

        Cliente cliente = findById(clienteId);

        return new HistorialClienteResponse(
                cliente,
                inscripcionRepository.findByClienteIdOrderByFechaDesc(
                        clienteId
                ),
                cotizacionRepository.findByClienteCorreoIgnoreCase(
                        cliente.getCorreo()
                ),
                alquilerRepository.findByClienteCorreoIgnoreCase(
                        cliente.getCorreo()
                ),
                cateringRepository.findByClienteCorreoIgnoreCase(
                        cliente.getCorreo()
                ),
                pagoRepository.findByClienteIdOrderByFechaDesc(
                        clienteId
                )
        );
    }

    // =========================================================
    // CREAR CLIENTE
    // =========================================================

    public Cliente save(Cliente entity) {
        return repository.save(entity);
    }

    // =========================================================
    // ACTUALIZAR CLIENTE
    // =========================================================

    public Cliente update(Long id, Cliente entity) {

        Cliente current = findById(id);

        copyFields(current, entity);

        return repository.save(current);
    }

    // =========================================================
    // ELIMINAR CLIENTE
    // =========================================================

    public void delete(Long id) {

        Cliente current = findById(id);

        repository.delete(current);
    }

    // =========================================================
    // COPIAR CAMPOS
    // =========================================================

    private void copyFields(
            Cliente current,
            Cliente incoming) {

        current.setDui(incoming.getDui());
        current.setNit(incoming.getNit());
        current.setNombre(incoming.getNombre());
        current.setEmpresa(incoming.getEmpresa());
        current.setCorreo(incoming.getCorreo());
        current.setTelefono(incoming.getTelefono());
        current.setDireccion(incoming.getDireccion());
    }
}