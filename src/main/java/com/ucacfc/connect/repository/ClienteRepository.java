package com.ucacfc.connect.repository;
import com.ucacfc.connect.model.Cliente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> { // <Trabaja con el modelo cliente, es de tipo Long>

    List<Cliente> findByNombreContainingIgnoreCase(String nombre);
}
