package br.ufes.gerenciapet.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import br.ufes.gerenciapet.backend.model.CityBrazil;

@RepositoryRestResource(collectionResourceRel = "city-brazil", path = "city-brazil")
public interface CityBrazilRepository extends JpaRepository<CityBrazil, Long> {

    List<CityBrazil> findByNameContainingIgnoreCase(@Param("name") String name);

    // Busca por nome (parcial, ignore case) E/OU nome do estado (parcial, ignore
    // case).
    // Qualquer parâmetro pode ser omitido (null ou vazio) – será ignorado no
    // filtro.
    @RestResource(path = "findByCityAndState", rel = "findByCityAndState")
    @Query("SELECT c FROM CityBrazil c " +
            "WHERE (:city IS NULL OR :city = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :city, '%'))) " +
            "AND (:state IS NULL OR :state = '' OR LOWER(c.stateBrazil.name) LIKE LOWER(CONCAT('%', :state, '%')))")
    List<CityBrazil> findByCityNameAndStateName(
            @Param("city") String city,
            @Param("state") String state);
}
