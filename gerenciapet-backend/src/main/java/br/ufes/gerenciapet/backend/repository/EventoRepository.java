package br.ufes.gerenciapet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.ufes.gerenciapet.backend.model.Evento;

@RepositoryRestResource(collectionResourceRel = "evento", path = "evento")
public interface EventoRepository extends JpaRepository<Evento, Long> {

}
