package br.ufes.gerenciapet.backend.repository;

import br.ufes.gerenciapet.backend.model.Inscricao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "inscricoes", path = "inscricoes")
public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {
}
