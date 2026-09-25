package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Usuario;
import com.ucacfc.connect.repository.UsuarioRepository;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Usuario> findAll(){
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    public Usuario save(Usuario entity) {
        return repository.save(entity);
    }

    public Usuario update(Long id, Usuario entity) {
        Usuario current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Usuario current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Usuario current, Usuario incoming) {
        current.setNombre(incoming.getNombre());
        current.setCorreo(incoming.getCorreo());
        current.setPassword(incoming.getPassword());
        current.setActivo(incoming.getActivo());
        current.setRol(incoming.getRol());
    }
}
