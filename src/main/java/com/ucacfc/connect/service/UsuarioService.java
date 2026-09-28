package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Usuario;
import com.ucacfc.connect.repository.UsuarioRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado con id: " + id
                        )
                );
    }

    @Transactional(readOnly = true)
    public Page<Usuario> search(
            String nombre,
            String correo,
            Long rolId,
            Boolean activo,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable =
                PageRequest.of(page, size, sort);

        if (nombre != null && !nombre.isBlank()) {
            return repository.findByNombreContainingIgnoreCase(
                    nombre,
                    pageable
            );
        }

        if (correo != null && !correo.isBlank()) {
            return repository.findByCorreoContainingIgnoreCase(
                    correo,
                    pageable
            );
        }

        if (rolId != null) {
            return repository.findByRolId(
                    rolId,
                    pageable
            );
        }

        if (activo != null) {
            return repository.findByActivo(
                    activo,
                    pageable
            );
        }

        return repository.findAll(pageable);
    }

    public Usuario save(Usuario entity) {

        entity.setPassword(
                passwordEncoder.encode(entity.getPassword())
        );

        return repository.save(entity);
    }

    public Usuario update(Long id, Usuario entity) {

        Usuario current = findById(id);

        current.setNombre(entity.getNombre());
        current.setCorreo(entity.getCorreo());

        current.setPassword(
                passwordEncoder.encode(entity.getPassword())
        );

        current.setActivo(entity.getActivo());
        current.setRol(entity.getRol());

        return repository.save(current);
    }

    public void delete(Long id) {

        Usuario current = findById(id);
        repository.delete(current);
    }
}