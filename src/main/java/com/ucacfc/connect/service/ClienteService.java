package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.repository.ClienteRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@SuppressWarnings("null")
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Cliente findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + id));
    }

    public Cliente save(Cliente entity) {
        return repository.save(entity);
    }

    public Cliente update(Long id, Cliente entity) {
        Cliente current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Cliente current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Cliente current, Cliente incoming) {
        current.setDui(incoming.getDui());
        current.setNit(incoming.getNit());
        current.setNombre(incoming.getNombre());
        current.setEmpresa(incoming.getEmpresa());
        current.setCorreo(incoming.getCorreo());
        current.setTelefono(incoming.getTelefono());
        current.setDireccion(incoming.getDireccion());
    }
}
