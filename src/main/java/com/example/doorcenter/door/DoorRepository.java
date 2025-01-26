package com.example.doorcenter.door;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoorRepository extends JpaRepository<Door, Long> {

    Optional<Door> findDoorById(Long id);

    @Query("SELECT d FROM Door d JOIN d.variants v WHERE v.height = :height AND v.width = :width")
    List<Door> findDoorsByHeightAndWidth(@Param("height") int height, @Param("width") int width);

}
