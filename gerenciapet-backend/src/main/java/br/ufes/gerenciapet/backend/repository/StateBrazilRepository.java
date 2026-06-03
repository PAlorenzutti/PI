package br.ufes.gerenciapet.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.ufes.gerenciapet.backend.model.StateBrazil;

@RepositoryRestResource(collectionResourceRel="state-brazil", path="state-brazil")
public interface StateBrazilRepository extends JpaRepository<StateBrazil, Long> {

    List<StateBrazil> findByNameContainingIgnoreCase(@Param("name") String name);

}
