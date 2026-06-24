package br.ufes.gerenciapet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.ufes.gerenciapet.backend.model.Extensionista;

@CrossOrigin(origins = "http://localhost:4203")
@RepositoryRestResource(collectionResourceRel = "extensionista", path = "extensionista")
public interface ExtensionistaRepository extends JpaRepository<Extensionista, Long> {
    Page<Extensionista> findByGrupoPetId(@Param("grupoPetId") Long grupoPetId, Pageable pageable);
    Extensionista findByUserEmail(@Param("email") String email);
}
