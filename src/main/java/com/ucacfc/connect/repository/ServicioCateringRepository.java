package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.ServicioCatering;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicioCateringRepository extends JpaRepository<ServicioCatering, Long> {

    List<ServicioCatering> findByActivoTrue();
}