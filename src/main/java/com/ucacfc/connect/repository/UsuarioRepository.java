package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
