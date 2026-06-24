package br.ufes.gerenciapet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import br.ufes.gerenciapet.backend.model.GrupoPet;

@CrossOrigin(origins = "http://localhost:4203")
@RepositoryRestResource(collectionResourceRel = "grupoPet", path = "grupoPet")
public interface GrupoPetRepository extends JpaRepository<GrupoPet, Long> {
    GrupoPet findBySigla(@Param("sigla") String sigla);
}
